import React, { useContext } from "react";
import { useTranslation } from "react-i18next";
import { Link, useParams } from "react-router-dom";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import { Avatar, Button, Popconfirm, Space, Table, Typography } from "antd";
import { AlertMessagesContext } from "contexts/alert-messages";
import { useDeleteCompany } from "hooks/use-companies/use-companies";
import { ICompanyListItem } from "types/company";

interface IProps {
  companies: ICompanyListItem[];
}

export default function CompaniesList({ companies }: IProps) {
  const { createError, createSuccess } = useContext(AlertMessagesContext);
  const { t } = useTranslation();
  const { id } = useParams();
  const { mutateAsync: deleteCompany } = useDeleteCompany();

  const confirmDelete = async (recordId: number) => {
    try {
      await deleteCompany({ portfolioId: +id!, companyId: recordId });
      createSuccess(t("Company deleted successfully"));
    } catch (error) {
      console.error(error);
      createError(t(`Error deleting company: ${error}`));
    }
  };

  const columns: any = [
    {
      title: "",
      dataIndex: "logo",
      key: "logo",
      render: (text: string) => <Avatar src={text} />,
    },
    {
      title: t("Name"),
      dataIndex: "name",
      key: "name",
      render: (text: string, record: ICompanyListItem) => (
        <>
          <Link to={`companies/${record.id}`}>{text}</Link>
          {record.sector !== null && (
            <>
              <br />
              <Typography.Text
                type="secondary"
                style={{ fontSize: "0.8em" }}
                title={record.sector.name}
              >
                {t(record.sector.name)}
              </Typography.Text>
            </>
          )}
        </>
      ),
      sorter: (a: ICompanyListItem, b: ICompanyListItem) =>
        a.name.localeCompare(b.name),
    },
    {
      title: t("Ticker"),
      dataIndex: "ticker",
      key: "ticker",
      sorter: (a: ICompanyListItem, b: ICompanyListItem) =>
        a.ticker.localeCompare(b.ticker),
    },
    {
      title: t("Shares"),
      dataIndex: "sharesCount",
      key: "sharesCount",
      sorter: (a: any, b: any) => +a.sharesCount - +b.sharesCount,
    },
    {
      title: t("Broker"),
      dataIndex: "broker",
      key: "broker",
      sorter: (a: ICompanyListItem, b: ICompanyListItem) =>
        a.broker.localeCompare(b.broker),
      responsive: ["md"],
    },
    {
      title: t("Invested"),
      dataIndex: "invested",
      key: "invested",
      render: (text: string, record: any) =>
        `${(+text).toFixed(2)} ${record.portfolioCurrency}`,
      sorter: (a: any, b: any) => +a.invested - +b.invested,
    },
    {
      title: t("Portfolio value"),
      dataIndex: "portfolioValue",
      key: "portfolioValue",
      render: (text: string, record: any) =>
        `${(+text).toFixed(2)} ${record.portfolioCurrency}`,
      sorter: (a: any, b: any) => +a.portfolioValue - +b.portfolioValue,
    },
    {
      title: t("Return w.d. %"),
      dataIndex: "returnWithDividendsPercent",
      key: "returnWithDividendsPercent",
      render: (text: string) => `${(+text).toFixed(2)} %`,
      sorter: (a: any, b: any) =>
        +a.returnWithDividendsPercent - +b.returnWithDividendsPercent,
    },
    {
      title: t("Dividends yield"),
      dataIndex: "dividendsYield",
      key: "dividendsYield",
      render: (text: string) => `${(+text).toFixed(2)} %`,
      sorter: (a: any, b: any) => +a.dividendsYield - +b.dividendsYield,
    },
    {
      title: t("Last"),
      dataIndex: "lastTransactionMonth",
      key: "lastTransactionMonth",
      sorter: (a: ICompanyListItem, b: ICompanyListItem) => {
        return (
          Date.parse(b.lastTransactionMonth) -
          Date.parse(a.lastTransactionMonth)
        );
      },
    },
    {
      key: "action",
      render: (text: string, record: any) => (
        <Space size="middle">
          <Link to={`companies/${record.id}/edit`}>
            <Button type="text" icon={<EditOutlined />} />
          </Link>
          <Popconfirm
            key={`delete-${record.key}`}
            title={`Delete company ${record.name}?`}
            onConfirm={() => confirmDelete(record.id)}
            okText="Yes"
            cancelText="No"
          >
            <Button type="text" danger icon={<DeleteOutlined />} />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const getData = () => {
    return companies.map((element: ICompanyListItem) => ({
      id: element.id,
      key: element.id,
      name: element.name,
      ticker: element.ticker,
      sharesCount: element.allStats ? element.allStats?.sharesCount : 0,
      description: element.description,
      dividendsYield: element.allStats ? element.allStats.dividendsYield : 0,
      color: element.color,
      portfolio: element.portfolio,
      logo: element.logo,
      countryCode: element.countryCode,
      sector: element.sector,
      broker: element.broker,
      invested: element.allStats ? element.allStats.invested : 0,
      portfolioValue: element.allStats ? element.allStats.portfolioValue : 0,
      returnWithDividendsPercent: element.allStats
        ? element.allStats.returnWithDividendsPercent
        : 0,
      portfolioCurrency: element.allStats
        ? element.allStats.portfolioCurrency
        : 0,
      lastTransactionMonth: element.lastTransactionMonth
        ? element.lastTransactionMonth
        : "",
    }));
  };

  return (
    <Table
      pagination={{ defaultPageSize: 60 }}
      columns={columns}
      dataSource={getData()}
      scroll={{ x: 600 }}
      style={{ marginTop: 16 }}
    />
  );
}
