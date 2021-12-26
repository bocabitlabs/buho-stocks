import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { Link, useParams } from "react-router-dom";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import { Button, Popconfirm, Space, Table } from "antd";
import useFetch from "use-http";
import { ICompany } from "types/company";

interface IProps {
  companies: ICompany[];
}

export default function CompaniesList({ companies: companiesProp }: IProps) {
  const { t } = useTranslation();
  const { id } = useParams();
  const [companies, setCompanies] = useState(companiesProp);
  const { response, del: deleteCompany } = useFetch("portfolios");

  const confirmDelete = async (recordId: number) => {
    console.log(`${id}/companies/${recordId}/`);
    await deleteCompany(`${id}/companies/${recordId}/`);
    if (response.ok) {
      const removeItem = companies.filter((market: ICompany) => {
        return market.id !== recordId;
      });
      setCompanies(removeItem);
    }
  };

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
      title: t("Ticker"),
      dataIndex: "ticker",
      key: "ticker",
      sorter: (a: ICompany, b: ICompany) => a.ticker.localeCompare(b.ticker)
    },
    {
      title: t("Name"),
      dataIndex: "name",
      key: "name",
      render: (text: string, record: ICompany) => (
        <Link to={`companies/${record.id}`}>{text}</Link>
      ),
      sorter: (a: ICompany, b: ICompany) => a.name.localeCompare(b.name)
    },
    {
      title: t("Description"),
      dataIndex: "description",
      key: "description",
      sorter: (a: ICompany, b: ICompany) =>
        a.description.localeCompare(b.description)
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
      )
    }
  ];

  const getData = () => {
    return companies.map((element: ICompany) => ({
      id: element.id,
      key: element.id,
      name: element.name,
      ticker: element.ticker,
      description: element.description,
      color: element.color,
      portfolio: element.portfolio
    }));
  };

  return <Table columns={columns} dataSource={getData()} />;
}
