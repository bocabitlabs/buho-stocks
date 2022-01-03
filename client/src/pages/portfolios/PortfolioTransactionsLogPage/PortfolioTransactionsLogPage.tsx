import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Spin } from "antd";
import useFetch from "use-http";
import LogMessagesList from "./components/LogMessagesList/LogMessagesList";
import PortfolioTransactionsLogPageHeader from "./components/PortfolioTransactionsLogPageHeader/PortfolioTransactionsLogPageHeader";
import { IPortfolio } from "types/portfolio";

export default function PortfolioDetailsPage() {
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
    <PortfolioTransactionsLogPageHeader
      portfolioName={portfolio.name}
      portfolioDescription={portfolio.description}
      portfolioCountryCode={portfolio.countryCode}
    >
      <LogMessagesList />
    </PortfolioTransactionsLogPageHeader>
  );
}
