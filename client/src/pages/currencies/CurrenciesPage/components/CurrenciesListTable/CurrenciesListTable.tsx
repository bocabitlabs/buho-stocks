import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Spin, Table } from "antd";
import useFetch from "use-http";
import { ICurrency } from "types/currency";

export default function CurrenciesListTable() {
  const [currencies, setCurrencies] = useState<ICurrency[]>([]);
  const { t } = useTranslation();
  const { response, loading, get } = useFetch("currencies");

  useEffect(() => {
    const fetchCurrencies = async () => {
      const results = await get();
      if (response.ok) {
        setCurrencies(results);
      }
    };

    fetchCurrencies();
  }, [get, response.ok]);

  const columns: any = [
    {
      title: t("Name"),
      dataIndex: "name",
      key: "name",
      render: (text: string) => <strong>{text}</strong>,
      sorter: (a: ICurrency, b: ICurrency) => a.name.localeCompare(b.name)
    },
    {
      title: t("Code"),
      dataIndex: "code",
      key: "code",
      sorter: (a: ICurrency, b: ICurrency) => a.code.localeCompare(b.code)
    },
    {
      title: t("Symbol"),
      dataIndex: "symbol",
      key: "symbol",
      render: (text: string) => text,
      sorter: (a: ICurrency, b: ICurrency) => a.symbol.localeCompare(b.symbol)
    },
    {
      title: t("Countries"),
      dataIndex: "countries",
      key: "countries",
      render: (text: string[]) => text.join(", "),
      sorter: (a: ICurrency, b: ICurrency) =>
        a.countries.localeCompare(b.countries)
    }
  ];

  const getData = () => {
    return currencies.map((currency: ICurrency) => ({
      id: currency.code,
      key: currency.code,
      name: currency.name,
      code: currency.code,
      countries: currency.countries,
      symbol: currency.symbol
    }));
  };

  if (loading) {
    return <Spin />;
  }

  return <Table columns={columns} dataSource={getData()} />;
}
