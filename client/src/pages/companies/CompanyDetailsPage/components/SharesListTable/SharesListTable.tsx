import React, { ReactElement, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Link, useParams } from "react-router-dom";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import { Button, Popconfirm, Space, Spin, Table } from "antd";
// eslint-disable-next-line import/no-extraneous-dependencies
import moment from "moment";
import useFetch from "use-http";
import { BuySellLabel } from "components/BuySellLabel/BuySellLabel";
import NotesRow from "components/NotesRow/NotesRow";
import { ISharesTransaction } from "types/shares-transaction";

export default function SharesListTable(): ReactElement {
  const { t } = useTranslation();
  const { companyId } = useParams();
  const [transactions, setTransactions] = useState<ISharesTransaction[]>([]);
  const {
    loading,
    response,
    get,
    del: deleteTransaction,
    cache,
  } = useFetch(`companies/${companyId}/shares`);

  const confirmDelete = async (recordId: number) => {
    console.log(recordId);
    // deleteMarketById(recordId);
    await deleteTransaction(`${recordId}/`);
    if (response.ok) {
      const removeItem = transactions.filter(
        (transaction: ISharesTransaction) => {
          return transaction.id !== recordId;
        },
      );
      setTransactions(removeItem);
      cache.clear();
    }
  };

  useEffect(() => {
    async function loadInitialShares() {
      const initialTransactions = await get();
      if (response.ok) setTransactions(initialTransactions);
    }
    loadInitialShares();
  }, [response.ok, get]);

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
    return transactions.map((transaction: ISharesTransaction) => ({
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
      expandable={{
        expandedRowRender: NotesRow,
        rowExpandable: (record) =>
          record.notes !== "undefined" && record.notes !== undefined,
      }}
    />
  );
}
