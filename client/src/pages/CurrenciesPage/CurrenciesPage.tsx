import React, { ReactElement } from "react";
import CurrenciesPageHeader from "./components/CurrenciesageHeader/CurrenciesPageHeader";
import CurrenciesListTable from "./components/CurrenciesListTable/CurrenciesListTable";
import { CurrenciesContext } from "contexts/currencies";
import { useCurrenciesContext } from "hooks/use-currencies/use-currencies-context";
import WrapperPage from "pages/WrapperPage/WrapperPage";

export default function CurrenciesPage(): ReactElement {
  const currenciesContext = useCurrenciesContext();

  return (
    <CurrenciesContext.Provider value={currenciesContext}>
      <WrapperPage>
        <CurrenciesPageHeader>
          <CurrenciesListTable />
        </CurrenciesPageHeader>
      </WrapperPage>
    </CurrenciesContext.Provider>
  );
}
