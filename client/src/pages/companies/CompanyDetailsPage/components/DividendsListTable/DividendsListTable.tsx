import React, { ReactElement, useContext } from "react";
import { useTranslation } from "react-i18next";
import { Link, useParams } from "react-router-dom";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import { Button, Popconfirm, Space, Spin, Table } from "antd";
// eslint-disable-next-line import/no-extraneous-dependencies
import moment from "moment";
import NotesRow from "components/NotesRow/NotesRow";
import { AlertMessagesContext } from "contexts/alert-messages";
import {
  useDeleteDividendsTransaction,
  useDividendsTransactions,
} from "hooks/use-dividends-transactions/use-dividends-transactions";
import { IDividendsTransaction } from "types/dividends-transaction";

export default function DividendsListTable(): ReactElement {
  const { t } = useTranslation();
  const { companyId } = useParams();
  const { createSuccess, createError } = useContext(AlertMessagesContext);
  const { isFetching: loading, data: transactions } = useDividendsTransactions(
    +companyId!,
  );
  const { mutateAsync: deleteTransaction } = useDeleteDividendsTransaction();

  const confirmDelete = async (recordId: number) => {
    try {
      await deleteTransaction({
        companyId: +companyId!,
        transactionId: recordId,
      });
      createSuccess(t("Dividends transaction deleted successfully"));
    } catch (error) {
      createError(t(`Error deleting dividends transaction: ${error}`));
    }
  };

  if (loading) {
    return <Spin />;
  }
  const columns: any = [
    {
      title: t("Date"),
      dataIndex: "transactionDate",
      key: "openTime",
      sorter: (a: IDividendsTransaction, b: IDividendsTransaction) =>
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
          <Link to={`dividends/${record.id}/`}>
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
    return transactions.map((transaction: IDividendsTransaction) => ({
      id: transaction.id,
      key: transaction.id,
      count: transaction.count,
      grossPricePerShare: transaction.grossPricePerShare,
      grossPricePerShareCurrency: transaction.grossPricePerShareCurrency,
      totalCommission: transaction.totalCommission,
      totalCommissionCurrency: transaction.totalCommissionCurrency,
      transactionDate: transaction.transactionDate,
      transactionTotal:
        +transaction.count * +transaction.grossPricePerShare -
        +transaction.totalCommission,
      notes: transaction.notes,
    }));
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
