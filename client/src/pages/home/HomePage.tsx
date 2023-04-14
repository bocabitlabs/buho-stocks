import React, { ReactElement } from "react";
import PortfoliosPageHeader from "./components/HomePageHeader/HomePageHeader";
import PortfolioList from "./components/PortfolioList/PortfolioList";

export default function HomePage(): ReactElement {
  return (
    <PortfoliosPageHeader>
      <PortfolioList />
    </PortfoliosPageHeader>
  );
}
