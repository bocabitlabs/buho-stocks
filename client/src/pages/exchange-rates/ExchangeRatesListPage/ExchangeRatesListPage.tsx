import React from "react";
import ExchangeRatesPageHeader from "./components/CurrenciesPageHeader/ExchangeRatesPageHeader";
import ExchangeRatesListTable from "./components/ExchangeRatesListTable/ExchangeRatesListTable";

export default function ExchangeRatesListPage() {
  return (
    <ExchangeRatesPageHeader>
      <ExchangeRatesListTable />
    </ExchangeRatesPageHeader>
  );
}
