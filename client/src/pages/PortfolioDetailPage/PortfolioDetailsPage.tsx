import React from "react";
import CompaniesList from "./components/CompaniesList/CompaniesList";
import PortfolioDetailsPageHeader from "./components/PortfolioDetailsPageHeader/PortfolioDetailsPageHeader";
import { CompaniesContext } from "contexts/companies";
import { CurrenciesContext } from "contexts/currencies";
import { PortfoliosContext } from "contexts/portfolios";
import { useCompaniesContext } from "hooks/use-companies/use-companies-context";
import { useCurrenciesContext } from "hooks/use-currencies/use-currencies-context";
import { usePortfoliosContext } from "hooks/use-portfolios/use-portfolios-context";
import WrapperPage from "pages/WrapperPage/WrapperPage";
import { IPortfolioRouteParams } from "types/portfolio";

// Params are placeholders in the URL that begin
// with a colon, like the `:id` param defined in
// the route in this example. A similar convention
// is used for matching dynami§wc segments in other
// popular web frameworks like Rails and Express.

export default function PortfolioDetailsPage({
  computedMatch: { params }
}: IPortfolioRouteParams) {
  const { id } = params;

  const context = usePortfoliosContext();
  const currenciesContext = useCurrenciesContext();
  const companiesContext = useCompaniesContext(id);

  return (
    <WrapperPage>
      <CurrenciesContext.Provider value={currenciesContext}>
        <PortfoliosContext.Provider value={context}>
          <PortfolioDetailsPageHeader portfolioId={+id}>
            <CompaniesContext.Provider value={companiesContext}>
              Portfolio ID: {JSON.stringify(id)}
              <CompaniesList />
            </CompaniesContext.Provider>
          </PortfolioDetailsPageHeader>
        </PortfoliosContext.Provider>
      </CurrenciesContext.Provider>
    </WrapperPage>
  );
}
