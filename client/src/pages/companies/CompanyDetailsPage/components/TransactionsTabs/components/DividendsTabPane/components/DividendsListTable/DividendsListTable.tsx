import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";
import {
  Button,
  Group,
  Loader,
  Menu,
  Modal,
  NumberFormatter,
  Stack,
  Text,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import {
  MantineReactTable,
  MRT_ColumnDef,
  MRT_PaginationState,
  MRT_Row,
  useMantineReactTable,
} from "mantine-react-table";
import DividendsTransactionFormProvider from "../DividendsTransactionForm/DividendsTransactionFormProvider";
import {
  useDeleteDividendsTransaction,
  useDividendsTransactions,
} from "hooks/use-dividends-transactions/use-dividends-transactions";
import { ICurrency } from "types/currency";
import { IDividendsTransaction } from "types/dividends-transaction";

interface IProps {
  companyDividendsCurrency: ICurrency;
  portfolioBaseCurrency: string;
}

function TotalPriceCell({
  row,
}: Readonly<{
  row: MRT_Row<IDividendsTransaction>;
}>) {
  return (
    <Stack>
      <NumberFormatter
        value={row.original.totalAmount}
        suffix={` ${row.original.totalAmountCurrency}`}
        decimalScale={2}
      />
    </Stack>
  );
}

function CommissionCell({
  row,
}: Readonly<{
  row: MRT_Row<IDividendsTransaction>;
}>) {
  const comissionPercentage =
    (+row.original.totalCommission / +row.original.totalAmount) * 100;
  return (
    <Group>
      <NumberFormatter
        value={row.original.totalCommission}
        suffix={` ${row.original.totalCommissionCurrency}`}
        decimalScale={2}
      />
      <Text c="dimmed" size="sm">
        (
        <NumberFormatter
          value={comissionPercentage}
          suffix={` %`}
          decimalScale={2}
        />
        )
      </Text>
    </Group>
  );
}

export default function DividendsListTable({
  companyDividendsCurrency,
  portfolioBaseCurrency,
}: IProps) {
  const { t } = useTranslation();
  const { companyId } = useParams();
  const [pagination, setPagination] = useState<MRT_PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });
  const { data, isLoading, isFetching, isError } = useDividendsTransactions(
    +companyId!,
    pagination,
  );
  const { mutate: deleteTransaction } = useDeleteDividendsTransaction();
  const [selectedId, setSelectedId] = useState<number | undefined>(undefined);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [deleteModalOpen, { open: openDeleteModal, close: closeDeleteModal }] =
    useDisclosure(false);

  const showModal = (recordId: number) => {
    setSelectedId(recordId);
    setIsModalVisible(true);
  };

  const showDeleteModal = (recordId: number) => {
    setSelectedId(recordId);
    openDeleteModal();
  };

  const onCloseCallback = () => {
    setIsModalVisible(false);
  };

  const confirmDelete = async (recordId: number | undefined) => {
    if (!recordId) return;
    deleteTransaction({
      transactionId: recordId,
    });
    closeDeleteModal();
  };

  const onDeleteCloseCallback = () => {
    closeDeleteModal();
    setSelectedId(undefined);
  };

  const columns = useMemo<MRT_ColumnDef<IDividendsTransaction>[]>(
    () => [
      {
        accessorKey: "transactionDate",
        header: t("Date"),
      },
      {
        accessorKey: "totalAmount",
        header: t("Total Amount"),
        Cell: TotalPriceCell,
      },
      {
        accessorKey: "totalCommission",
        header: t("Total Commission"),
        Cell: CommissionCell,
      },
    ],
    [],
  );

  const fetchedTransactions = data?.results ?? [];
  const totalRowCount = data?.count ?? 0;

  const table = useMantineReactTable({
    columns,
    data: fetchedTransactions,
    enableRowActions: true,
    enableToolbarInternalActions: false,
    enableTopToolbar: false,
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

  if (isLoading) {
    return <Loader />;
  }

  return (
    <div>
      <MantineReactTable table={table} />
      <DividendsTransactionFormProvider
        transactionId={selectedId}
        companyId={+companyId!}
        isUpdate
        isVisible={isModalVisible}
        onCloseCallback={onCloseCallback}
        companyDividendsCurrency={companyDividendsCurrency}
        portfolioBaseCurrency={portfolioBaseCurrency}
      />
      <Modal
        opened={deleteModalOpen}
        onClose={closeDeleteModal}
        title={t("Delete transaction")}
      >
        {t("Are you sure you want to delete this transaction?")}
        <Group>
          <Button
            disabled={!selectedId}
            onClick={() => confirmDelete(selectedId)}
          >
            {t("Yes")}
          </Button>
          <Button onClick={onDeleteCloseCallback}>{t("No")}</Button>
        </Group>
      </Modal>
    </div>
  );
}
