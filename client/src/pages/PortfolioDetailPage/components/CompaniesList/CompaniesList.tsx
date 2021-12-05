import React, { useContext } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import { Button, Popconfirm, Space, Spin, Table } from "antd";
// eslint-disable-next-line import/no-extraneous-dependencies
import { CompaniesContext } from "contexts/companies";
import { PortfoliosContext } from "contexts/portfolios";
import getRoute, { MARKETS_ROUTE } from "routes";
import { ICompany } from "types/company";
import { IMarket } from "types/market";

export default function CompaniesList() {
  const { deleteById: deleteCompanyById } = useContext(CompaniesContext);

  const { isLoading, portfolio } = useContext(PortfoliosContext);

  const { t } = useTranslation();

  function confirm(recordId: number) {
    console.log(recordId);
    deleteCompanyById(recordId);
  }

  const columns: any = [
    {
      title: "",
      dataIndex: "color",
      key: "color",
      render: (text: string) => (
        <svg height="20" width="20">
          <circle cx="10" cy="10" r="10" fill={text} />
        </svg>
      )
    },
    {
      title: t("Name"),
      dataIndex: "name",
      key: "name",
      render: (text: string, record: ICompany) => (
        <Link to={`/app/portfolios/${record.portfolio}/companies/${record.id}`}>
          {text}
        </Link>
      ),
      sorter: (a: IMarket, b: IMarket) => a.name.localeCompare(b.name)
    },
    {
      title: t("Description"),
      dataIndex: "description",
      key: "description",
      sorter: (a: IMarket, b: IMarket) =>
        a.description.localeCompare(b.description)
    },
    {
      title: t("Action"),
      key: "action",
      render: (text: string, record: any) => (
        <Space size="middle">
          <Link to={`${getRoute(MARKETS_ROUTE)}/${record.id}`}>
            <Button icon={<EditOutlined />} />
          </Link>
          <Popconfirm
            key={`market-delete-${record.key}`}
            title={`Delete company ${record.name}?`}
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

  if (isLoading || !portfolio) {
    return <Spin />;
  }

  const getData = () => {
    if (portfolio) {
      return portfolio.companies.map((element: ICompany) => ({
        id: element.id,
        key: element.id,
        name: element.name,
        description: element.description,
        color: element.color,
        portfolio: element.portfolio
      }));
    }
    return [];
  };

  return (
    <>
      <Table columns={columns} dataSource={getData()} />
    </>
  );
}
