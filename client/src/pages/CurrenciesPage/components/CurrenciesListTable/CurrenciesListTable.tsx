import React, { useContext, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import { Button, Popconfirm, Space, Spin, Table } from "antd";
import CountryFlag from "components/CountryFlag/CountryFlag";
import { CurrenciesContext } from "contexts/currencies";
import getRoute, { CURRENCIES_ROUTE } from "routes";
import { ICurrency } from "types/currency";

export default function CurrenciesListTable() {
  const {
    currencies,
    isLoading,
    getAll: getCurrencies,
    deleteById: deleteCurrencyById
  } = useContext(CurrenciesContext);
  const { t } = useTranslation();

  useEffect(() => {
    const getAllCurrencies = async () => {
      getCurrencies();
    };
    getAllCurrencies();
  }, [getCurrencies]);

  function confirm(recordId: number) {
    console.log(recordId);
    deleteCurrencyById(recordId);
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
      render: (text: string) => <strong>{text}</strong>,
      sorter: (a: ICurrency, b: ICurrency) => a.name.localeCompare(b.name)
    },
    {
      title: t("Abbreviation"),
      dataIndex: "abbreviation",
      key: "abbreviation",
      sorter: (a: ICurrency, b: ICurrency) =>
        a.abbreviation.localeCompare(b.abbreviation)
    },
    {
      title: t("Symbol"),
      dataIndex: "symbol",
      key: "symbol",
      render: (text: string) => text,
      sorter: (a: ICurrency, b: ICurrency) => a.symbol.localeCompare(b.symbol)
    },
    {
      title: t("Country"),
      dataIndex: "country",
      key: "country",
      render: (text: string) => <CountryFlag code={text} />,
      sorter: (a: ICurrency, b: ICurrency) => a.country.localeCompare(b.country)
    },
    {
      title: t("Action"),
      key: "action",
      render: (text: string, record: any) => (
        <Space size="middle">
          <Link to={`${getRoute(CURRENCIES_ROUTE)}/${record.id}`}>
            <Button icon={<EditOutlined />} />
          </Link>
          <Popconfirm
            key={`market-delete-${record.key}`}
            title={`Delete currency ${record.name}?`}
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
    return currencies.map((currency: ICurrency) => ({
      id: currency.id,
      key: currency.id,
      name: currency.name,
      abbreviation: currency.abbreviation,
      country: currency.country,
      symbol: currency.symbol,
      color: currency.color
    }));
  };

  if (isLoading) {
    return <Spin />;
  }

  return (
    <>
      <Table columns={columns} dataSource={getData()} />
    </>
  );
}
