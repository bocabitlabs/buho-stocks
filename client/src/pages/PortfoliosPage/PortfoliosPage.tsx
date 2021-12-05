import React, { ReactElement } from "react";
import PortfolioList from "./components/PortfolioList/PortfolioList";
import PortfoliosPageHeader from "./components/PortfoliosPageHeader/PortfoliosPageHeader";
import { PortfoliosContext } from "contexts/portfolios";
import { usePortfoliosContext } from "hooks/use-portfolios/use-portfolios-context";
import WrapperPage from "pages/WrapperPage/WrapperPage";

export default function PortfoliosPage(): ReactElement {
  const portfoliosContext = usePortfoliosContext();

  return (
    <PortfoliosContext.Provider value={portfoliosContext}>
      <WrapperPage>
        <PortfoliosPageHeader>
          <PortfolioList />
        </PortfoliosPageHeader>
      </WrapperPage>
    </PortfoliosContext.Provider>
  );
}
