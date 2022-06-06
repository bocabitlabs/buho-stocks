import React, { ReactElement } from "react";
import CurrenciesListTable from "./components/CurrenciesListTable/CurrenciesListTable";
import CurrenciesPageHeader from "./components/CurrenciesPageHeader/CurrenciesPageHeader";

export default function CurrenciesPage(): ReactElement {
  return (
    <CurrenciesPageHeader>
      <CurrenciesListTable />
    </CurrenciesPageHeader>
  );
}
