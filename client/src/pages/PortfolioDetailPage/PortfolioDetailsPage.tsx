import React from "react";
import { useParams } from "react-router-dom";
import CompaniesList from "./components/CompaniesList/CompaniesList";
import PortfolioDetailsLoader from "./components/PortfolioDetailsLoader/PortfolioDetailsLoader";
import PortfolioDetailsPageHeader from "./components/PortfolioDetailsPageHeader/PortfolioDetailsPageHeader";
import { CompaniesContext } from "contexts/companies";
import { CurrenciesContext } from "contexts/currencies";
import { PortfoliosContext } from "contexts/portfolios";
import { useCompaniesContext } from "hooks/use-companies/use-companies-context";
import { useCurrenciesContext } from "hooks/use-currencies/use-currencies-context";
import { usePortfoliosContext } from "hooks/use-portfolios/use-portfolios-context";
import WrapperPage from "pages/WrapperPage/WrapperPage";

// Params are placeholders in the URL that begin
// with a colon, like the `:id` param defined in
// the route in this example. A similar convention
// is used for matching dynami§wc segments in other
// popular web frameworks like Rails and Express.

export interface IParams {
  id: string;
}

export default function PortfolioDetailsPage() {
  const params = useParams<IParams>();
  const { id } = params;

  const portfoliosContext = usePortfoliosContext();
  const currenciesContext = useCurrenciesContext();
  const companiesContext = useCompaniesContext(id);

  return (
    <CurrenciesContext.Provider value={currenciesContext}>
      <PortfoliosContext.Provider value={portfoliosContext}>
        <CompaniesContext.Provider value={companiesContext}>
          <PortfolioDetailsLoader>
            <WrapperPage>
              <PortfolioDetailsPageHeader>
                Portfolio ID: {JSON.stringify(id)}
                <CompaniesList />
              </PortfolioDetailsPageHeader>
            </WrapperPage>
          </PortfolioDetailsLoader>
        </CompaniesContext.Provider>
      </PortfoliosContext.Provider>
    </CurrenciesContext.Provider>
  );
}
