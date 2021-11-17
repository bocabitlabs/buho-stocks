import React, { ReactElement } from "react";
import PortfolioList from "./components/PortfolioList/PortfolioList";
import PortfoliosPageHeader from "./components/PortfoliosPageHeader/PortfoliosPageHeader";
import { PortfoliosContext } from "contexts/portfolios";
import { usePortfoliosContext } from "hooks/use-portfolios/use-portfolios-context";
import WrapperPage from "pages/WrapperPage/WrapperPage";

export default function PortfoliosPage(): ReactElement {
  const portfoliosContext = usePortfoliosContext();

  return (
    <WrapperPage>
      <PortfoliosContext.Provider value={portfoliosContext}>
        <PortfoliosPageHeader>
          <PortfolioList />
        </PortfoliosPageHeader>
      </PortfoliosContext.Provider>
    </WrapperPage>
  );
}
