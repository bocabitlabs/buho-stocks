import React from "react";
import { useParams } from "react-router-dom";
import { Spin } from "antd";
import CompaniesList from "./components/CompaniesList/CompaniesList";
import PortfolioDetailsPageHeader from "./components/PortfolioDetailsPageHeader/PortfolioDetailsPageHeader";
import YearSelector from "./components/YearSelector/YearSelector";
import { usePortfolio } from "hooks/use-portfolios/use-portfolios";

export default function PortfolioDetailsPage() {
  const { id } = useParams();
  const { data: portfolio } = usePortfolio(+id!);

  if (!portfolio) {
    return <Spin />;
  }
  return (
    <PortfolioDetailsPageHeader
      portfolioName={portfolio.name}
      portfolioDescription={portfolio.description}
      portfolioCountryCode={portfolio.countryCode}
    >
      <YearSelector
        id={id}
        firstYear={portfolio.firstYear}
        companies={portfolio ? portfolio.companies : []}
      />
      <CompaniesList companies={portfolio ? portfolio.companies : []} />
    </PortfolioDetailsPageHeader>
  );
}
