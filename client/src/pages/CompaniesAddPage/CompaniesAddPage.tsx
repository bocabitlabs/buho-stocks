import React, { ReactElement } from "react";
import { Col, Row } from "antd";
import CompanyAddPageHeader from "./components/CompaniesAddPageHeader/CompaniesAddPageHeader";
import CompanyAddEditForm from "components/CompanyAddEditForm/CompanyAddEditForm";
import { CompaniesContext } from "contexts/companies";
import { CurrenciesContext } from "contexts/currencies";
import { MarketsContext } from "contexts/markets";
import { SectorsContext } from "contexts/secctors";
import { useCompaniesContext } from "hooks/use-companies/use-companies-context";
import { useCurrenciesContext } from "hooks/use-currencies/use-currencies-context";
import { useMarketsContext } from "hooks/use-markets/use-markets-context";
import { useSectorsContext } from "hooks/use-sectors/use-sectors-context";
import WrapperPage from "pages/WrapperPage/WrapperPage";
import { IPortfolioRouteParams } from "types/portfolio";

export default function CompaniesAddPage({
  computedMatch: { params }
}: IPortfolioRouteParams): ReactElement {
  const { id } = params;

  const context = useCompaniesContext(id);
  const currenciesContext = useCurrenciesContext();
  const marketsContext = useMarketsContext();
  const sectorsContext = useSectorsContext();

  console.log("Add company page");
  return (
    <WrapperPage>
      <CurrenciesContext.Provider value={currenciesContext}>
        <MarketsContext.Provider value={marketsContext}>
          <SectorsContext.Provider value={sectorsContext}>
            <CompaniesContext.Provider value={context}>
              <CompanyAddPageHeader portfolioId={id}>
                <Row>
                  <Col>
                    <CompanyAddEditForm portfolioId={id} />
                  </Col>
                  <Col />
                </Row>
              </CompanyAddPageHeader>
            </CompaniesContext.Provider>
          </SectorsContext.Provider>
        </MarketsContext.Provider>
      </CurrenciesContext.Provider>
    </WrapperPage>
  );
}
