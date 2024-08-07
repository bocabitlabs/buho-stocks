import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { Button, Group, Menu, Modal, Text } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import {
  MantineReactTable,
  MRT_ColumnDef,
  MRT_Localization,
  MRT_PaginationState,
  useMantineReactTable,
} from "mantine-react-table";
import CurrencyFormProvider from "../CurrencyForm/CurrencyFormProvider";
import {
  useCurrencies,
  useDeleteCurrency,
} from "hooks/use-currencies/use-currencies";
import { ICurrency } from "types/currency";

interface Props {
  mrtLocalization: MRT_Localization;
}

function NameCell({ row }: Readonly<{ row: any }>) {
  const { t } = useTranslation();
  return (
    <Text fw={700} size="sm">
      {t(row.original.name)}
    </Text>
  );
}

export default function CurrenciesListTable({ mrtLocalization }: Props) {
  const { t } = useTranslation();
  const [pagination, setPagination] = useState<MRT_PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });
  const { data, isLoading, isFetching, isError } = useCurrencies({
    pagination,
  });

  const { mutate: deleteCurrency } = useDeleteCurrency();
  const [selectedCurrencyId, setSelectedCurrencyId] = useState<
    number | undefined
  >(undefined);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [deleteModalOpen, { open: openDeleteModal, close: closeDeleteModal }] =
    useDisclosure(false);
  const showModal = (recordId: number) => {
    setSelectedCurrencyId(recordId);
    setIsModalVisible(true);
  };

  const showDeleteModal = (recordId: number) => {
    setSelectedCurrencyId(recordId);
    openDeleteModal();
  };

  const confirmDelete = async (recordId: number | undefined) => {
    if (!recordId) return;
    deleteCurrency(recordId);
    closeDeleteModal();
  };

  const onCloseCallback = () => {
    setIsModalVisible(false);
    setSelectedCurrencyId(undefined);
  };

  const onDeleteCloseCallback = () => {
    closeDeleteModal();
    setSelectedCurrencyId(undefined);
  };

  const columns = useMemo<MRT_ColumnDef<ICurrency>[]>(
    () => [
      {
        accessorKey: "name",
        header: t("Name"),
        Cell: NameCell,
      },
      {
        accessorKey: "code",
        header: t("Code"),
      },
      {
        accessorKey: "symbol",
        header: t("Symbol"),
      },
    ],
    [t],
  );

  const fetchedCurrencies = data?.results ?? [];
  const totalRowCount = data?.count ?? 0;

  const table = useMantineReactTable({
    columns,
    data: fetchedCurrencies, // must be memoized or stable (useState, useMemo, defined outside of this component, etc.)
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
    mantineToolbarAlertBannerProps: isError
      ? {
          color: "red",
          children: t("Error loading data"),
        }
      : undefined,
    onPaginationChange: setPagination,
    state: {
      isLoading,
      showAlertBanner: isError,
      showProgressBars: isFetching,
      pagination,
    },
    localization: mrtLocalization,
  });

  return (
    <div>
      <MantineReactTable table={table} />
      <CurrencyFormProvider
        id={selectedCurrencyId}
        isVisible={isModalVisible}
        onCloseCallback={onCloseCallback}
      />
      <Modal
        opened={deleteModalOpen}
        onClose={closeDeleteModal}
        title={t("Delete currency")}
      >
        <Text>{t("Are you sure you want to delete this currency?")}</Text>
        <Group mt="md">
          <Button
            disabled={!selectedCurrencyId}
            onClick={() => confirmDelete(selectedCurrencyId)}
          >
            {t("Yes")}
          </Button>
          <Button onClick={onDeleteCloseCallback}>{t("No")}</Button>
        </Group>
      </Modal>
    </div>
  );
}
