import React, { ReactElement } from "react";
import { useParams } from "react-router-dom";
import DividendsTransactionEditPageHeader from "./components/DividendsTransactioneditPageHeader/DividendsTransactionEditPageHeader";
import DividendsTransactionLoader from "./components/DividendsTransactionsLoader/DividendsTransactionLoader";
import DividendsTransactionAddEditForm from "components/DividendsTransactionAddEditForm copy/DividendsTransactionAddEditForm";
import { CompaniesContext } from "contexts/companies";
import { DividendsTransactionsContext } from "contexts/dividends-transactions";
import { ExchangeRatesContext } from "contexts/exchange-rates";
import { PortfoliosContext } from "contexts/portfolios";
import { useCompaniesContext } from "hooks/use-companies/use-companies-context";
import { usePortfoliosContext } from "hooks/use-companies/use-portfolios-context";
import { useDividendsTransactionsContext } from "hooks/use-dividends-transactions/use-dividends-transactions-context";
import { useExchangeRatesContext } from "hooks/use-exchange-rates/use-exchange-rates-context";
import WrapperPage from "pages/WrapperPage/WrapperPage";

export interface IParams {
  id: string;
  companyId: string;
}

export default function DividendsTransactionsEditPage(): ReactElement {
  const { id, companyId } = useParams<IParams>();

  const companiesContext = useCompaniesContext(id);
  const portfoliosContext = usePortfoliosContext();
  const dividendsTransactionsContext =
    useDividendsTransactionsContext(companyId);
  const exchangeRatesContext = useExchangeRatesContext();

  return (
    <PortfoliosContext.Provider value={portfoliosContext}>
      <CompaniesContext.Provider value={companiesContext}>
        <DividendsTransactionsContext.Provider
          value={dividendsTransactionsContext}
        >
          <ExchangeRatesContext.Provider value={exchangeRatesContext}>
            <DividendsTransactionLoader>
              <WrapperPage>
                <DividendsTransactionEditPageHeader>
                  <DividendsTransactionAddEditForm />
                </DividendsTransactionEditPageHeader>
              </WrapperPage>
            </DividendsTransactionLoader>
          </ExchangeRatesContext.Provider>
        </DividendsTransactionsContext.Provider>
      </CompaniesContext.Provider>
    </PortfoliosContext.Provider>
  );
}
