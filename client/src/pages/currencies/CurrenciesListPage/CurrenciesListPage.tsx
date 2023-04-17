import React from "react";
import CurrenciesListTable from "./components/CurrenciesListTable/CurrenciesListTable";
import CurrenciesPageHeader from "./components/CurrenciesPageHeader/CurrenciesPageHeader";

export default function CurrenciesListPage() {
  return (
    <CurrenciesPageHeader>
      <CurrenciesListTable />
    </CurrenciesPageHeader>
  );
}
