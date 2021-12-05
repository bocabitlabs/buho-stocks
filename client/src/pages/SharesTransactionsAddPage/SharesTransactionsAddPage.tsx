import React, { ReactElement } from "react";
import { useParams } from "react-router-dom";
import SharesTransactionAddPageHeader from "./components/SharesTransactionAddPageHeader/SharesTransactionAddPageHeader";
import SharesTransactionLoader from "./components/SharesTransactionsLoader/SharesTransactionLoader";
import SharesTransactionAddEditForm from "components/SharesTransactionAddEditForm/SharesTransactionAddEditForm";
import { CompaniesContext } from "contexts/companies";
import { ExchangeRatesContext } from "contexts/exchange-rates";
import { PortfoliosContext } from "contexts/portfolios";
import { SharesTransactionsContext } from "contexts/shares-transactions";
import { useCompaniesContext } from "hooks/use-companies/use-companies-context";
import { usePortfoliosContext } from "hooks/use-companies/use-portfolios-context";
import { useExchangeRatesContext } from "hooks/use-exchange-rates/use-exchange-rates-context";
import { useSharesTransactionsContext } from "hooks/use-shares-transactions/use-shares-transactions-context";
import WrapperPage from "pages/WrapperPage/WrapperPage";

export interface IParams {
  id: string;
  companyId: string;
}

export default function SharesTransactionsAddPage(): ReactElement {
  const { id, companyId } = useParams<IParams>();

  const companiesContext = useCompaniesContext(id);
  const portfoliosContext = usePortfoliosContext();
  const sharesTransactionsContext = useSharesTransactionsContext(companyId);
  const exchangeRatesContext = useExchangeRatesContext();

  return (
    <PortfoliosContext.Provider value={portfoliosContext}>
      <CompaniesContext.Provider value={companiesContext}>
        <SharesTransactionsContext.Provider value={sharesTransactionsContext}>
          <ExchangeRatesContext.Provider value={exchangeRatesContext}>
            <SharesTransactionLoader>
              <WrapperPage>
                <SharesTransactionAddPageHeader>
                  <SharesTransactionAddEditForm />
                </SharesTransactionAddPageHeader>
              </WrapperPage>
            </SharesTransactionLoader>
          </ExchangeRatesContext.Provider>
        </SharesTransactionsContext.Provider>
      </CompaniesContext.Provider>
    </PortfoliosContext.Provider>
  );
}
