import React from "react";
import { useTranslation } from "react-i18next";
import { Table } from "antd";
import { useCurrencies } from "hooks/use-currencies/use-currencies";
import { ICurrency } from "types/currency";

export default function CurrenciesListTable() {
  const { t } = useTranslation();
  const { status, data, error, isFetching } = useCurrencies();

  const columns: any = [
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
    {
      title: t("Countries"),
      dataIndex: "countries",
      key: "countries",
      render: (text: string[]) => text.join(", "),
      sorter: (a: ICurrency, b: ICurrency) =>
        a.countries.localeCompare(b.countries),
    },
  ];

  const getData = () => {
    return (
      data &&
      data.map((currency: ICurrency) => ({
        id: currency.code,
        key: currency.code,
        name: currency.name,
        code: currency.code,
        countries: currency.countries,
        symbol: currency.symbol,
      }))
    );
  };

  if (isFetching) {
    return <div>{isFetching ? <div>Fetching data...</div> : <div />}</div>;
  }

  if (error) {
    return <div>Error fetching the data from the API</div>;
  }

  if (status === "loading") {
    return <div>Loading</div>;
  }

  return (
    <div>
      <Table columns={columns} dataSource={getData()} />
    </div>
  );
}
