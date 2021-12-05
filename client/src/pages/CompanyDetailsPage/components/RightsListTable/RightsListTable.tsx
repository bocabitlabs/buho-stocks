import React, { ReactElement, useContext } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import { Button, Popconfirm, Space, Spin, Table } from "antd";
// eslint-disable-next-line import/no-extraneous-dependencies
import moment from "moment";
import { BuySellLabel } from "components/BuySellLabel/BuySellLabel";
import { CompaniesContext } from "contexts/companies";
import getRoute, { RIGHTS_EDIT_ROUTE } from "routes";
import { IRightsTransaction } from "types/rights-transaction";

export default function RightsListTable(): ReactElement {
  const { t } = useTranslation();
  const { isLoading, company } = useContext(CompaniesContext);

  function confirm(recordId: number) {
    console.log(recordId);
    // deleteMarketById(recordId);
  }

  if (isLoading || !company) {
    return <Spin />;
  }
  const columns: any = [
    {
      title: t("Type"),
      dataIndex: "type",
      key: "type",
      render: (text: string) => <BuySellLabel value={text} />,
      sorter: (a: IRightsTransaction, b: IRightsTransaction) =>
        a.type.localeCompare(b.type)
    },
    {
      title: t("Date"),
      dataIndex: "transactionDate",
      key: "openTime",
      sorter: (a: IRightsTransaction, b: IRightsTransaction) =>
        a.transactionDate.localeCompare(b.transactionDate),
      render: (text: string) => moment(new Date(text)).format("DD/MM/YYYY")
    },
    {
      title: t("Count"),
      dataIndex: "count",
      key: "count",
      render: (text: string) => text
    },
    {
      title: t("Gross price per share"),
      dataIndex: "grossPricePerShare",
      key: "grossPricePerShare",
      render: (text: number, record: any) =>
        `${(+text).toFixed(2)} ${record.grossPricePerShareCurrency}`
    },
    {
      title: t("Total commission"),
      dataIndex: "totalCommission",
      key: "totalCommission",
      render: (text: number, record: any) =>
        `${(+text).toFixed(2)} ${record.totalCommissionCurrency}`
    },
    {
      title: t("Total"),
      dataIndex: "transactionTotal",
      key: "transactionTotal",
      render: (text: number, record: any) =>
        `${(+text).toFixed(2)} ${record.grossPricePerShareCurrency}`
    },
    {
      title: t("Action"),
      key: "action",
      render: (text: string, record: any) => (
        <Space size="middle">
          <Link
            to={`${getRoute(RIGHTS_EDIT_ROUTE)
              .replace(":id", company.portfolio.toString())
              .replace(":companyId", company.id.toString())
              .replace(":transactionId", record.id.toString())}`}
          >
            <Button icon={<EditOutlined />} />
          </Link>
          <Popconfirm
            key={`market-delete-${record.key}`}
            title={`Delete market ${record.name}?`}
            onConfirm={() => confirm(record.id)}
            okText="Yes"
            cancelText="No"
          >
            <Button danger icon={<DeleteOutlined />} />
          </Popconfirm>
        </Space>
      )
    }
  ];

  const getData = () => {
    return company.rightsTransactions.map(
      (transaction: IRightsTransaction) => ({
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
          transaction.count * +transaction.grossPricePerShare +
          +transaction.totalCommission,
        notes: transaction.notes
      })
    );
  };

  if (isLoading) {
    return <Spin />;
  }

  return (
    <Table
      size="small"
      columns={columns}
      bordered
      dataSource={getData()}
      expandable={{
        expandedRowRender: (record) => (
          <p style={{ margin: 0 }}>{record.notes}</p>
        ),
        rowExpandable: (record) =>
          record.notes !== "undefined" && record.notes !== undefined
      }}
    />
  );
}
