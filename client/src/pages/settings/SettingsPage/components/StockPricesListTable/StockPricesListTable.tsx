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
  MRT_Row,
  MRT_SortingState,
  useMantineReactTable,
} from "mantine-react-table";
import StockPriceFormProvider from "../StockPriceAddEditForm/StockPriceFormProvider";
import {
  useDeleteStockPrice,
  useStockPrices,
} from "hooks/use-stock-prices/use-stock-prices";
import { IStockPrice } from "types/stock-prices";

interface Props {
  mrtLocalization: MRT_Localization;
}

function PriceCell({ row }: Readonly<{ row: MRT_Row<IStockPrice> }>) {
  return (
    <span>
      {row.original.price} {row.original.priceCurrency}
    </span>
  );
}

export default function StockPricesListTable({ mrtLocalization }: Props) {
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
      id: "transactionDate",
    },
  ]);
  const [pagination, setPagination] = useState<MRT_PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });
  const { data, isFetching, isError, isLoading } = useStockPrices({
    sorting,
    pagination,
  });

  const { mutate: deleteStockPrice } = useDeleteStockPrice();
  const [selectedStockPriceId, setSelectedStockPriceId] = useState<
    number | undefined
  >(undefined);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [deleteModalOpen, { open: openDeleteModal, close: closeDeleteModal }] =
    useDisclosure(false);

  const showModal = (recordId: number) => {
    setSelectedStockPriceId(recordId);
    setIsModalVisible(true);
  };

  const showDeleteModal = (recordId: number) => {
    setSelectedStockPriceId(recordId);
    openDeleteModal();
  };

  const confirmDelete = async (recordId: number | undefined) => {
    if (!recordId) return;
    deleteStockPrice(recordId);
    setSelectedStockPriceId(undefined);
    closeDeleteModal();
  };

  const onCloseCallback = () => {
    setIsModalVisible(false);
    setSelectedStockPriceId(undefined);
  };

  const onDeleteCloseCallback = () => {
    closeDeleteModal();
    setSelectedStockPriceId(undefined);
  };

  const columns = useMemo<MRT_ColumnDef<IStockPrice>[]>(
    () => [
      {
        accessorKey: "transactionDate",
        header: t("Date"),
      },

      {
        accessorKey: "price",
        header: t("Price"),
        Cell: PriceCell,
      },
      {
        accessorKey: "ticker",
        header: t("Ticker"),
      },
    ],
    [t],
  );

  const fetchedStockPrices = data?.results ?? [];
  const totalRowCount = data?.count ?? 0;

  const table = useMantineReactTable({
    columns,
    data: fetchedStockPrices, // must be memoized or stable (useState, useMemo, defined outside of this component, etc.)
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
      <Title order={4}>{t("Stock Prices")}</Title>

      <Group>
        <Button leftSection={<IconPlus />} onClick={showAddModal}>
          {t("Add stock price")}
        </Button>
      </Group>
      <StockPriceFormProvider
        onCloseCallback={onCloseAdd}
        isVisible={isAddModalVisible}
      />
      <MantineReactTable table={table} />
      <StockPriceFormProvider
        id={selectedStockPriceId}
        isUpdate
        isVisible={isModalVisible}
        onCloseCallback={onCloseCallback}
      />
      <Modal
        opened={deleteModalOpen}
        onClose={closeDeleteModal}
        title={t("Delete stock price")}
      >
        <Text>{t("Are you sure you want to delete this stock price?")}</Text>
        <Group mt="md">
          <Button
            disabled={!selectedStockPriceId}
            onClick={() => confirmDelete(selectedStockPriceId)}
          >
            {t("Yes")}
          </Button>
          <Button onClick={onDeleteCloseCallback}>{t("No")}</Button>
        </Group>
      </Modal>
    </Stack>
  );
}
