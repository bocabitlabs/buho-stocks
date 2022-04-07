import React from "react";
import { useParams } from "react-router-dom";
import { Spin } from "antd";
import ChartsList from "./components/ChartsList/ChartsList";
import PortfolioChartsPageHeader from "./components/PortfolioChartsPageHeader/PortfolioChartsPageHeader";
import { usePortfolio } from "hooks/use-portfolios/use-portfolios";

export default function PortfolioChartsPage() {
  const { id } = useParams();
  const { data: portfolio } = usePortfolio(+id!);

  if (!portfolio) {
    return <Spin />;
  }
  return (
    <PortfolioChartsPageHeader
      portfolioName={portfolio.name}
      portfolioDescription={portfolio.description}
      portfolioCountryCode={portfolio.countryCode}
    >
      <ChartsList />
    </PortfolioChartsPageHeader>
  );
}
