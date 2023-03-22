import React from "react";
import ExchangeRatesListTable from "./components/ExchangeRatesListTable/ExchangeRatesListTable";
import ExchangeRatesPageHeader from "./components/ExchangeRatesPageHeader/ExchangeRatesPageHeader";

export default function ExchangeRatesListPage() {
  return (
    <ExchangeRatesPageHeader>
      <ExchangeRatesListTable />
    </ExchangeRatesPageHeader>
  );
}
