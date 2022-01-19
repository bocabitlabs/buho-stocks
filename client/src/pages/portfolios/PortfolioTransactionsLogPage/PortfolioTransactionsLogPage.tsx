import React from "react";
import { useParams } from "react-router-dom";
import { Spin } from "antd";
import LogMessagesList from "./components/LogMessagesList/LogMessagesList";
import PortfolioTransactionsLogPageHeader from "./components/PortfolioTransactionsLogPageHeader/PortfolioTransactionsLogPageHeader";
import { usePortfolio } from "hooks/use-portfolios/use-portfolios";

export default function PortfolioDetailsPage() {
  const { id } = useParams();
  const { data: portfolio } = usePortfolio(+id!);

  if (!portfolio) {
    return <Spin />;
  }
  return (
    <PortfolioTransactionsLogPageHeader
      portfolioName={portfolio.name}
      portfolioCountryCode={portfolio.countryCode}
    >
      <LogMessagesList />
    </PortfolioTransactionsLogPageHeader>
  );
}
