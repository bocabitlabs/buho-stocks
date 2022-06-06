import React from "react";
import { useTranslation } from "react-i18next";
import { Table } from "antd";
import { useCurrencies } from "hooks/use-currencies/use-currencies";
import { ICurrency } from "types/currency";

export default function CurrenciesListTable() {
  const { t } = useTranslation();
  const { data: currencies, error, isFetching } = useCurrencies();

  const columns: any = [
    {
      title: "#",
      dataIndex: "count",
      key: "count",
    },
    {
      title: t("Name"),
      dataIndex: "name",
      key: "name",
      render: (text: string) => <strong>{text}</strong>,
      sorter: (a: ICurrency, b: ICurrency) => a.name.localeCompare(b.name),
    },
    {
      title: t("Code"),
      dataIndex: "code",
      key: "code",
      sorter: (a: ICurrency, b: ICurrency) => a.code.localeCompare(b.code),
    },
    {
      title: t("Symbol"),
      dataIndex: "symbol",
      key: "symbol",
      render: (text: string) => text,
      sorter: (a: ICurrency, b: ICurrency) => a.symbol.localeCompare(b.symbol),
    },
  ];

  const getData = () => {
    return (
      currencies &&
      currencies.map((currency: ICurrency, index: number) => ({
        id: currency.code,
        count: index + 1,
        key: currency.code,
        name: currency.name,
        code: currency.code,
        countries: currency.countries,
        symbol: currency.symbol,
      }))
    );
  };

  if (error) {
    return <div>Error fetching the data from the API</div>;
  }

  return (
    <div>
      <Table columns={columns} dataSource={getData()} loading={isFetching} />
    </div>
  );
}
