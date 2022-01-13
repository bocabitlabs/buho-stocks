import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { Link, useParams } from "react-router-dom";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import { Avatar, Button, Popconfirm, Space, Table, Typography } from "antd";
import useFetch from "use-http";
import CountryFlag from "components/CountryFlag/CountryFlag";
import { ICompany } from "types/company";

interface IProps {
  companies: ICompany[];
}

export default function CompaniesList({ companies: companiesProp }: IProps) {
  const { t } = useTranslation();
  const { id } = useParams();
  const [companies, setCompanies] = useState(companiesProp);
  const { response, del: deleteCompany, cache } = useFetch("portfolios");

  const confirmDelete = async (recordId: number) => {
    await deleteCompany(`${id}/companies/${recordId}/`);
    if (response.ok) {
      const removeItem = companies.filter((market: ICompany) => {
        return market.id !== recordId;
      });
      setCompanies(removeItem);
      cache.clear();
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
      render: (text: string, record: ICompany) => (
        <>
          <Link to={`companies/${record.id}`}>{text}</Link> ({record.ticker})
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
      sorter: (a: ICompany, b: ICompany) => a.name.localeCompare(b.name),
    },
    {
      title: t("Country"),
      dataIndex: "countryCode",
      key: "countryCode",
      render: (text: string) => <CountryFlag code={text} />,
      sorter: (a: ICompany, b: ICompany) =>
        a.countryCode.localeCompare(b.countryCode),
      responsive: ["md"],
    },
    {
      title: t("Broker"),
      dataIndex: "broker",
      key: "broker",
      sorter: (a: ICompany, b: ICompany) => a.broker.localeCompare(b.broker),
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
      title: t("Action"),
      key: "action",
      render: (text: string, record: any) => (
        <Space size="middle">
          <Link to={`companies/${record.id}/edit`}>
            <Button icon={<EditOutlined />} />
          </Link>
          <Popconfirm
            key={`market-delete-${record.key}`}
            title={`Delete company ${record.name}?`}
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
    return companies.map((element: ICompany) => ({
      id: element.id,
      key: element.id,
      name: element.name,
      ticker: element.ticker,
      description: element.description,
      color: element.color,
      portfolio: element.portfolio,
      logo: element.logo,
      countryCode: element.countryCode,
      sector: element.sector,
      broker: element.broker,
      invested: element.stats.find((stat: any) => stat.year > 2050).invested,
      portfolioValue: element.stats.find((stat: any) => stat.year > 2050)
        .portfolioValue,
      returnWithDividendsPercent: element.stats.find(
        (stat: any) => stat.year > 2050,
      ).returnWithDividendsPercent,
      portfolioCurrency: element.stats.find((stat: any) => stat.year > 2050)
        .portfolioCurrency,
    }));
  };

  return (
    <Table
      columns={columns}
      dataSource={getData()}
      scroll={{ x: 800 }}
      style={{ marginTop: 16 }}
    />
  );
}
