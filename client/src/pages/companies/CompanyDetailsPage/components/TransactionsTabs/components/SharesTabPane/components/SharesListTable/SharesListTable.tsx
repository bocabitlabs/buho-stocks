import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";
import {
  Badge,
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
  MRT_Localization,
  MRT_PaginationState,
  MRT_Row,
  useMantineReactTable,
} from "mantine-react-table";
import SharesTransactionFormProvider from "../SharesTransactionForm/SharesTransactionFormProvider";
import {
  useDeleteSharesTransaction,
  useSharesTransactions,
} from "hooks/use-shares-transactions/use-shares-transactions";
import { ICurrency } from "types/currency";
import { ISharesTransaction } from "types/shares-transaction";

interface IProps {
  companyBaseCurrency: ICurrency;
  portfolioBaseCurrency: string;
  mrtLocalization: MRT_Localization;
}

function TotalPriceCell({
  row,
}: Readonly<{
  row: MRT_Row<ISharesTransaction>;
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
  row: MRT_Row<ISharesTransaction>;
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

function TypeCell({
  row,
}: Readonly<{
  row: MRT_Row<ISharesTransaction>;
}>) {
  const { t } = useTranslation();
  return (
    <Badge color={row.original.type === "BUY" ? "green" : "red"}>
      {t(row.original.type)}
    </Badge>
  );
}

function PricePerShareCell({
  row,
}: Readonly<{
  row: MRT_Row<ISharesTransaction>;
}>) {
  return (
    <Stack>
      <NumberFormatter
        value={row.original.grossPricePerShare}
        suffix={` ${row.original.grossPricePerShareCurrency}`}
        decimalScale={2}
      />
    </Stack>
  );
}

export default function DividendsListTable({
  companyBaseCurrency,
  portfolioBaseCurrency,
  mrtLocalization,
}: IProps) {
  const { t } = useTranslation();
  const { companyId } = useParams();
  const [pagination, setPagination] = useState<MRT_PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });
  const { data, isLoading, isFetching, isError } = useSharesTransactions(
    +companyId!,
    pagination,
  );
  const { mutate: deleteTransaction } = useDeleteSharesTransaction();
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

  const columns = useMemo<MRT_ColumnDef<ISharesTransaction>[]>(
    () => [
      {
        accessorKey: "type",
        header: t("Type"),
        Cell: TypeCell,
      },
      {
        accessorKey: "transactionDate",
        header: t("Date"),
      },
      {
        accessorKey: "grossPricePerShare",
        header: t("Gross price per share"),
        Cell: PricePerShareCell,
      },
      {
        accessorKey: "count",
        header: t("Shares count"),
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
    [t],
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
    localization: mrtLocalization,
  });

  if (isLoading) {
    return <Loader />;
  }

  return (
    <div>
      <MantineReactTable table={table} />
      <SharesTransactionFormProvider
        transactionId={selectedId}
        companyId={+companyId!}
        isUpdate
        isVisible={isModalVisible}
        onCloseCallback={onCloseCallback}
        companyBaseCurrency={companyBaseCurrency}
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
