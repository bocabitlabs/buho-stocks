import React, { ReactElement } from "react";
import { useParams } from "react-router-dom";
import RightsTransactionEditPageHeader from "./components/RightsTransactioneditPageHeader/RightsTransactionEditPageHeader";
import RightsTransactionAddEditForm from "components/RightsTransactionAddEditForm/RightsTransactionAddEditForm";
import { CompaniesContext } from "contexts/companies";
import { ExchangeRatesContext } from "contexts/exchange-rates";
import { PortfoliosContext } from "contexts/portfolios";
import { RightsTransactionsContext } from "contexts/rights-transactions";
import { useCompaniesContext } from "hooks/use-companies/use-companies-context";
import { usePortfoliosContext } from "hooks/use-companies/use-portfolios-context";
import { useExchangeRatesContext } from "hooks/use-exchange-rates/use-exchange-rates-context";
import { useRightsTransactionsContext } from "hooks/use-rights-transactions/use-rights-transactions-context";
import RightsTransactionLoader from "pages/RightsTransactionsAddPage/components/RightsTransactionsLoader/RightsTransactionLoader";
import WrapperPage from "pages/WrapperPage/WrapperPage";

export interface IParams {
  id: string;
  companyId: string;
}

export default function RightsTransactionsEditPage(): ReactElement {
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
                <RightsTransactionEditPageHeader>
                  <RightsTransactionAddEditForm />
                </RightsTransactionEditPageHeader>
              </WrapperPage>
            </RightsTransactionLoader>
          </ExchangeRatesContext.Provider>
        </RightsTransactionsContext.Provider>
      </CompaniesContext.Provider>
    </PortfoliosContext.Provider>
  );
}
