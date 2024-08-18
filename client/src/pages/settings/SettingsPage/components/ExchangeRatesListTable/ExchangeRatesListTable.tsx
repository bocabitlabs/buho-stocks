import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { Button, Group, Menu, Modal, Stack, Title, Text } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { IconPlus } from "@tabler/icons-react";
import {
  MantineReactTable,
  MRT_ColumnDef,
  MRT_Localization,
  MRT_PaginationState,
  MRT_SortingState,
  useMantineReactTable,
} from "mantine-react-table";
import ExchangeRateFormProvider from "../ExchangeRateForm/ExchangeRateFormProvider";
import InfoMessageAddManually from "../InfoMessageAddManually/InfoMessageAddManually";
import {
  useDeleteExchangeRate,
  useExchangeRates,
} from "hooks/use-exchange-rates/use-exchange-rates";
import { IExchangeRate } from "types/exchange-rate";

interface Props {
  mrtLocalization: MRT_Localization;
}

export default function ExchangeRatesListTable({ mrtLocalization }: Props) {
  const { t } = useTranslation();
  const [isAddModalVisible, setIsAddModalVisible] = useState(false);

  const showAddModal = () => {
    setIsAddModalVisible(true);
  };

  const onCloseAdd = () => {
    setIsAddModalVisible(false);
  };

  const [sorting, setSorting] = useState<MRT_SortingState>([
    {
      desc: true,
      id: "exchangeDate",
    },
  ]);
  const [pagination, setPagination] = useState<MRT_PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });

  const { data, isFetching, isLoading, isError } = useExchangeRates({
    sorting,
    pagination,
  });

  const { mutate: deleteExchangeRate } = useDeleteExchangeRate();
  const [selectedExchangeRateId, setSelectedExchangeRateId] = useState<
    number | undefined
  >(undefined);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [deleteModalOpen, { open: openDeleteModal, close: closeDeleteModal }] =
    useDisclosure(false);

  const showModal = (recordId: number) => {
    setSelectedExchangeRateId(recordId);
    setIsModalVisible(true);
  };

  const showDeleteModal = (recordId: number) => {
    setSelectedExchangeRateId(recordId);
    openDeleteModal();
  };

  const confirmDelete = async (recordId: number | undefined) => {
    if (!recordId) return;
    deleteExchangeRate(recordId);
    setSelectedExchangeRateId(undefined);
    closeDeleteModal();
  };

  const onCloseCallback = () => {
    setIsModalVisible(false);
    setSelectedExchangeRateId(undefined);
  };

  const onDeleteCloseCallback = () => {
    closeDeleteModal();
    setSelectedExchangeRateId(undefined);
  };

  const columns = useMemo<MRT_ColumnDef<IExchangeRate>[]>(
    () => [
      {
        accessorKey: "exchangeDate",
        header: t("Date"),
      },
      {
        accessorKey: "exchangeFrom",
        header: t("From"),
      },
      {
        accessorKey: "exchangeTo",
        header: t("To"),
      },
      {
        accessorKey: "exchangeRate",
        header: t("Value"),
      },
    ],
    [t],
  );

  const fetchedRates = data?.results ?? [];
  const totalRowCount = data?.count ?? 0;

  const table = useMantineReactTable({
    columns,
    data: fetchedRates, // must be memoized or stable (useState, useMemo, defined outside of this component, etc.)
    enableRowActions: true,
    positionActionsColumn: "last",
    renderRowActionMenuItems: ({ row }) => (
      <>
        <Menu.Item onClick={() => showModal(row.original.id)}>
          {t("Edit")}
        </Menu.Item>
        <Menu.Item onClick={() => showDeleteModal(row.original.id)}>
          {t("Delete")}
        </Menu.Item>
      </>
    ),
    rowCount: totalRowCount,
    manualPagination: true,
    manualSorting: true,
    sortDescFirst: true,
    mantineToolbarAlertBannerProps: isError
      ? {
          color: "red",
          children: t("Error loading data"),
        }
      : undefined,
    onPaginationChange: setPagination,
    onSortingChange: setSorting,
    state: {
      isLoading,
      showAlertBanner: isError,
      showProgressBars: isFetching,
      pagination,
      sorting,
    },
    localization: mrtLocalization,
  });

  return (
    <Stack mt={20}>
      <Title order={4}>{t("Exchange Rates")}</Title>
      <InfoMessageAddManually />
      <Group>
        <Button leftSection={<IconPlus />} onClick={showAddModal}>
          {t("Add exchange rate")}
        </Button>
      </Group>
      <ExchangeRateFormProvider
        isVisible={isAddModalVisible}
        onCloseCallback={onCloseAdd}
      />
      <MantineReactTable table={table} />
      <ExchangeRateFormProvider
        id={selectedExchangeRateId}
        isUpdate
        isVisible={isModalVisible}
        onCloseCallback={onCloseCallback}
      />
      <Modal
        opened={deleteModalOpen}
        onClose={closeDeleteModal}
        title={t("Delete exchange rate")}
      >
        <Text>{t("Are you sure you want to delete this exchange rate?")}</Text>
        <Group mt="md">
          <Button
            disabled={!selectedExchangeRateId}
            onClick={() => confirmDelete(selectedExchangeRateId)}
          >
            {t("Yes")}
          </Button>
          <Button onClick={onDeleteCloseCallback}>{t("No")}</Button>
        </Group>
      </Modal>
    </Stack>
  );
}
