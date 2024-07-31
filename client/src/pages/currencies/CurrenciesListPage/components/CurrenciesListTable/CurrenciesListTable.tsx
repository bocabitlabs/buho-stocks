import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { Button, Group, Menu, Modal } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import {
  MantineReactTable,
  MRT_ColumnDef,
  MRT_PaginationState,
  useMantineReactTable,
} from "mantine-react-table";
import CurrencyFormProvider from "../CurrencyForm/CurrencyFormProvider";
import {
  useCurrencies,
  useDeleteCurrency,
} from "hooks/use-currencies/use-currencies";
import { ICurrency } from "types/currency";

export default function CurrenciesListTable() {
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
        header: "Name",
      },
      {
        accessorKey: "code",
        header: "Code",
      },
      {
        accessorKey: "symbol",
        header: "Symbol",
      },
    ],
    [],
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
        <Menu.Item onClick={() => showModal(row.original.id)}>Edit</Menu.Item>
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
          children: "Error loading data",
        }
      : undefined,
    onPaginationChange: setPagination,
    state: {
      isLoading,
      showAlertBanner: isError,
      showProgressBars: isFetching,
      pagination,
    },
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
        title={t("Delete market")}
      >
        {t("Are you sure you want to delete this currency?")}
        <Group>
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
