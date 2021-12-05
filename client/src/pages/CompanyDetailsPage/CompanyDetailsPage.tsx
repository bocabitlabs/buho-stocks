import React, { ReactElement } from "react";
import { useParams } from "react-router-dom";
import CompanyDetailsLoader from "./components/CompanyDetailsLoader/CompanyDetailsLoader";
import CompanyDetailsPageHeader from "./components/CompanyDetailsPageHeader/CompanyDetailsPageHeader";
import CompanyInfo from "./components/CompanyInfo/CompanyInfo";
import TransactionsTabs from "./components/TransactionsTabs/TransactionsTabs";
import { CompaniesContext } from "contexts/companies";
import { CurrenciesContext } from "contexts/currencies";
import { MarketsContext } from "contexts/markets";
import { PortfoliosContext } from "contexts/portfolios";
import { SectorsContext } from "contexts/secctors";
import { useCompaniesContext } from "hooks/use-companies/use-companies-context";
import { useCurrenciesContext } from "hooks/use-currencies/use-currencies-context";
import { useMarketsContext } from "hooks/use-markets/use-markets-context";
import { usePortfoliosContext } from "hooks/use-portfolios/use-portfolios-context";
import { useSectorsContext } from "hooks/use-sectors/use-sectors-context";
import WrapperPage from "pages/WrapperPage/WrapperPage";

export interface IParams {
  id: string;
  companyId: string;
}

export default function CompanyDetailsPage(): ReactElement {
  const params = useParams<IParams>();
  const { id } = params;

  const companiesContext = useCompaniesContext(id);
  const currenciesContext = useCurrenciesContext();
  const marketsContext = useMarketsContext();
  const sectorsContext = useSectorsContext();
  const portfoliosContext = usePortfoliosContext();

  return (
    <CurrenciesContext.Provider value={currenciesContext}>
      <MarketsContext.Provider value={marketsContext}>
        <SectorsContext.Provider value={sectorsContext}>
          <CompaniesContext.Provider value={companiesContext}>
            <PortfoliosContext.Provider value={portfoliosContext}>
              <CompanyDetailsLoader>
                <WrapperPage>
                  <CompanyDetailsPageHeader>
                    <CompanyInfo />
                    <TransactionsTabs />
                  </CompanyDetailsPageHeader>
                </WrapperPage>
              </CompanyDetailsLoader>
            </PortfoliosContext.Provider>
          </CompaniesContext.Provider>
        </SectorsContext.Provider>
      </MarketsContext.Provider>
    </CurrenciesContext.Provider>
  );
}
