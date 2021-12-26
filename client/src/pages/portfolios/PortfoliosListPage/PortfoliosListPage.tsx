import React, { ReactElement } from "react";
import PortfolioList from "./components/PortfolioList/PortfolioList";
import PortfoliosPageHeader from "./components/PortfoliosPageHeader/PortfoliosPageHeader";

export default function PortfoliosPage(): ReactElement {
  return (
    <PortfoliosPageHeader>
      <PortfolioList />
    </PortfoliosPageHeader>
  );
}
