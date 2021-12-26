import React, { ReactElement } from "react";
import CurrenciesPageHeader from "./components/CurrenciesageHeader/CurrenciesPageHeader";
import CurrenciesListTable from "./components/CurrenciesListTable/CurrenciesListTable";

export default function CurrenciesPage(): ReactElement {
  return (
    <CurrenciesPageHeader>
      <CurrenciesListTable />
    </CurrenciesPageHeader>
  );
}
