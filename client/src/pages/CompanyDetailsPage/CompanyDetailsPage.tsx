import React, { ReactElement } from "react";
import CompanyDetailsPageHeader from "./components/CompanyDetailsPageHeader/CompanyDetailsPageHeader";
import { CompaniesContext } from "contexts/companies";
import { CurrenciesContext } from "contexts/currencies";
import { MarketsContext } from "contexts/markets";
import { SectorsContext } from "contexts/secctors";
import { useCompaniesContext } from "hooks/use-companies/use-companies-context";
import { useCurrenciesContext } from "hooks/use-currencies/use-currencies-context";
import { useMarketsContext } from "hooks/use-markets/use-markets-context";
import { useSectorsContext } from "hooks/use-sectors/use-sectors-context";
import WrapperPage from "pages/WrapperPage/WrapperPage";
import { ICompanyRouteParams } from "types/company";

export default function CompanyDetailsPage({
  computedMatch: { params }
}: ICompanyRouteParams): ReactElement {
  const { id, companyId } = params;

  const context = useCompaniesContext(id);
  const currenciesContext = useCurrenciesContext();
  const marketsContext = useMarketsContext();
  const sectorsContext = useSectorsContext();

  return (
    <WrapperPage>
      <CurrenciesContext.Provider value={currenciesContext}>
        <MarketsContext.Provider value={marketsContext}>
          <SectorsContext.Provider value={sectorsContext}>
            <CompaniesContext.Provider value={context}>
              <CompanyDetailsPageHeader portfolioId={id} companyId={companyId}>
                This is content of the company details
              </CompanyDetailsPageHeader>
            </CompaniesContext.Provider>
          </SectorsContext.Provider>
        </MarketsContext.Provider>
      </CurrenciesContext.Provider>
    </WrapperPage>
  );
}
