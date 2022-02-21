import React from "react";
import { useTranslation } from "react-i18next";
import { Link, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import { Button, Popconfirm, Space, Spin, Table } from "antd";
// eslint-disable-next-line import/no-extraneous-dependencies
import moment from "moment";
import { BuySellLabel } from "components/BuySellLabel/BuySellLabel";
import NotesRow from "components/NotesRow/NotesRow";
import {
  useDeleteSharesTransaction,
  useSharesTransactions,
} from "hooks/use-shares-transactions/use-shares-transactions";
import { ISharesTransaction } from "types/shares-transaction";

export default function SharesListTable() {
  const { t } = useTranslation();
  const { companyId } = useParams();
  const { isFetching: loading, data: transactions } = useSharesTransactions(
    +companyId!,
  );
  const { mutateAsync: deleteTransaction } = useDeleteSharesTransaction();

  const confirmDelete = async (recordId: number) => {
    try {
      await deleteTransaction({
        companyId: +companyId!,
        transactionId: recordId,
      });
      toast.success(t("Shares transaction deleted successfully"));
    } catch (error) {
      toast.error(t(`Error deleting shares transaction: ${error}`));
    }
  };

  if (loading) {
    return <Spin />;
  }
  const columns: any = [
    {
      title: t("Type"),
      dataIndex: "type",
      key: "type",
      render: (text: string) => <BuySellLabel value={text} />,
      sorter: (a: ISharesTransaction, b: ISharesTransaction) =>
        a.type.localeCompare(b.type),
    },
    {
      title: t("Date"),
      dataIndex: "transactionDate",
      key: "openTime",
      sorter: (a: ISharesTransaction, b: ISharesTransaction) =>
        a.transactionDate.localeCompare(b.transactionDate),
      render: (text: string) => moment(new Date(text)).format("DD/MM/YYYY"),
    },
    {
      title: t("Count"),
      dataIndex: "count",
      key: "count",
      render: (text: string) => text,
    },
    {
      title: t("Gross price per share"),
      dataIndex: "grossPricePerShare",
      key: "grossPricePerShare",
      render: (text: number, record: any) =>
        `${(+text).toFixed(2)} ${record.grossPricePerShareCurrency}`,
    },
    {
      title: t("Total commission"),
      dataIndex: "totalCommission",
      key: "totalCommission",
      render: (text: number, record: any) =>
        `${(+text).toFixed(2)} ${record.totalCommissionCurrency}`,
    },
    {
      title: t("Total"),
      dataIndex: "transactionTotal",
      key: "transactionTotal",
      render: (text: number, record: any) =>
        `${(+text).toFixed(2)} ${record.grossPricePerShareCurrency}`,
    },
    {
      title: t("Action"),
      key: "action",
      render: (text: string, record: any) => (
        <Space size="middle">
          <Link to={`shares/${record.id}/`}>
            <Button icon={<EditOutlined />} />
          </Link>
          <Popconfirm
            key={`market-delete-${record.key}`}
            title={`Delete transaction ${record.name}?`}
            onConfirm={() => confirmDelete(record.id)}
            okText="Yes"
            cancelText="No"
          >
            <Button danger icon={<DeleteOutlined />} />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const getData = () => {
    return (
      transactions &&
      transactions.map((transaction: ISharesTransaction) => ({
        id: transaction.id,
        key: transaction.id,
        count: transaction.count,
        type: transaction.type,
        grossPricePerShare: transaction.grossPricePerShare,
        grossPricePerShareCurrency: transaction.grossPricePerShareCurrency,
        totalCommission: transaction.totalCommission,
        totalCommissionCurrency: transaction.totalCommissionCurrency,
        transactionDate: transaction.transactionDate,
        transactionTotal:
          +transaction.count * +transaction.grossPricePerShare +
          +transaction.totalCommission,
        notes: transaction.notes,
      }))
    );
  };

  if (loading) {
    return <Spin />;
  }

  return (
    <Table
      size="small"
      columns={columns}
      bordered
      dataSource={getData()}
      scroll={{ x: 800 }}
      expandable={{
        expandedRowRender: NotesRow,
        rowExpandable: (record) =>
          record.notes !== "undefined" && record.notes !== undefined,
      }}
    />
  );
}
