import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Spin } from "antd";
import useFetch from "use-http";
import ChartsList from "./components/ChartsList/ChartsList";
import PortfolioChartsPageHeader from "./components/PortfolioChartsPageHeader/PortfolioChartsPageHeader";
import { IPortfolio } from "types/portfolio";

export default function PortfolioChartsPage() {
  const { id } = useParams();
  const [portfolio, setPortfolio] = useState<IPortfolio | null>(null);
  const { response, get } = useFetch("portfolios");
  useEffect(() => {
    async function loadInitialPortfolio() {
      const initialPortfolio = await get(`${id}/`);
      if (response.ok) setPortfolio(initialPortfolio);
    }
    loadInitialPortfolio();
  }, [response.ok, get, id]);

  if (!portfolio) {
    return <Spin />;
  }
  return (
    <PortfolioChartsPageHeader
      portfolioName={portfolio.name}
      portfolioDescription={portfolio.description}
      portfolioCountryCode={portfolio.countryCode}
    >
      <ChartsList firstYear={portfolio.firstYear} />
    </PortfolioChartsPageHeader>
  );
}
