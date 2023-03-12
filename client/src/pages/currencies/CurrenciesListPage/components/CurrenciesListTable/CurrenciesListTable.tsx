import React from "react";
import { useTranslation } from "react-i18next";
import { Alert, Table } from "antd";
import { useCurrencies } from "hooks/use-currencies/use-currencies";
import { ICurrency } from "types/currency";

export default function CurrenciesListTable() {
  const { t } = useTranslation();
  const { data: markets, error, isFetching } = useCurrencies();

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
      sorter: (a: ICurrency, b: ICurrency) => a.symbol.localeCompare(b.symbol),
    },
  ];

  const getData = () => {
    return (
      markets &&
      markets.map((currency: ICurrency, index: number) => ({
        id: currency.id,
        count: index + 1,
        key: currency.id,
        name: currency.name,
        code: currency.code,
        symbol: currency.symbol,
      }))
    );
  };

  if (error) {
    return (
      <Alert
        showIcon
        message={t("Unable to load currencies")}
        description={error.message}
        type="error"
      />
    );
  }

  return (
    <div>
      <Table
        scroll={{ x: 600 }}
        style={{ marginTop: 16 }}
        columns={columns}
        dataSource={getData()}
        loading={isFetching}
      />
    </div>
  );
}
