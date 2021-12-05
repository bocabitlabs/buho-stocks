import React, { ReactElement } from "react";
import { useParams } from "react-router-dom";
import RightsTransactionAddPageHeader from "./components/RightsTransactionAddPageHeader/RightsTransactionAddPageHeader";
import RightsTransactionLoader from "./components/RightsTransactionsLoader/RightsTransactionLoader";
import RightsTransactionAddEditForm from "components/RightsTransactionAddEditForm/RightsTransactionAddEditForm";
import { CompaniesContext } from "contexts/companies";
import { ExchangeRatesContext } from "contexts/exchange-rates";
import { PortfoliosContext } from "contexts/portfolios";
import { RightsTransactionsContext } from "contexts/rights-transactions";
import { useCompaniesContext } from "hooks/use-companies/use-companies-context";
import { usePortfoliosContext } from "hooks/use-companies/use-portfolios-context";
import { useExchangeRatesContext } from "hooks/use-exchange-rates/use-exchange-rates-context";
import { useRightsTransactionsContext } from "hooks/use-rights-transactions/use-rights-transactions-context";
import WrapperPage from "pages/WrapperPage/WrapperPage";

export interface IParams {
  id: string;
  companyId: string;
}

export default function SharesTransactionsAddPage(): ReactElement {
  const { id, companyId } = useParams<IParams>();

  const companiesContext = useCompaniesContext(id);
  const portfoliosContext = usePortfoliosContext();
  const rightsTransactionsContext = useRightsTransactionsContext(companyId);
  const exchangeRatesContext = useExchangeRatesContext();

  return (
    <PortfoliosContext.Provider value={portfoliosContext}>
      <CompaniesContext.Provider value={companiesContext}>
        <RightsTransactionsContext.Provider value={rightsTransactionsContext}>
          <ExchangeRatesContext.Provider value={exchangeRatesContext}>
            <RightsTransactionLoader>
              <WrapperPage>
                <RightsTransactionAddPageHeader>
                  <RightsTransactionAddEditForm />
                </RightsTransactionAddPageHeader>
              </WrapperPage>
            </RightsTransactionLoader>
          </ExchangeRatesContext.Provider>
        </RightsTransactionsContext.Provider>
      </CompaniesContext.Provider>
    </PortfoliosContext.Provider>
  );
}
