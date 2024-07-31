import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { Button, Group, Menu, Modal } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import {
  MantineReactTable,
  MRT_ColumnDef,
  MRT_PaginationState,
  MRT_SortingState,
  useMantineReactTable,
} from "mantine-react-table";
import ExchangeRateFormProvider from "../ExchangeRateForm/ExchangeRateFormProvider";
import {
  useDeleteExchangeRate,
  useExchangeRates,
} from "hooks/use-exchange-rates/use-exchange-rates";
import { IExchangeRate } from "types/exchange-rate";

export default function ExchangeRatesListTable() {
  const { t } = useTranslation();
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
        accessorKey: "exchangeFrom",
        header: "From",
      },
      {
        accessorKey: "exchangeTo",
        header: "To",
      },
      {
        accessorKey: "exchangeRate",
        header: "Value",
      },
      {
        accessorKey: "exchangeDate",
        header: "Date",
      },
    ],
    [],
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
        <Menu.Item onClick={() => showModal(row.original.id)}>Edit</Menu.Item>
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
          children: "Error loading data",
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
  });

  return (
    <div>
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
        title={t("Delete sector")}
      >
        {t("Are you sure you want to delete this exchange rate?")}
        <Group>
          <Button
            disabled={!selectedExchangeRateId}
            onClick={() => confirmDelete(selectedExchangeRateId)}
          >
            {t("Yes")}
          </Button>
          <Button onClick={onDeleteCloseCallback}>{t("No")}</Button>
        </Group>
      </Modal>
    </div>
  );
}
