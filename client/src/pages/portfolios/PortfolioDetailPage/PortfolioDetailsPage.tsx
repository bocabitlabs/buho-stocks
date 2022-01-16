import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Spin } from "antd";
import useFetch from "use-http";
import CompaniesList from "./components/CompaniesList/CompaniesList";
import PortfolioDetailsPageHeader from "./components/PortfolioDetailsPageHeader/PortfolioDetailsPageHeader";
import YearSelector from "./components/YearSelector/YearSelector";
import { IPortfolio } from "types/portfolio";

export default function PortfolioDetailsPage() {
  const { id } = useParams();
  const [portfolio, setPortfolio] = useState<IPortfolio | null>(null);
  const { response, get } = useFetch("portfolios");
  useEffect(() => {
    async function loadInitialPortfolio() {
      const initialPortfolio = await get(`${id}/`);
      if (response.ok) {
        setPortfolio(initialPortfolio);
      }
    }
    loadInitialPortfolio();
  }, [response.ok, get, id]);

  if (!portfolio) {
    return <Spin />;
  }
  return (
    <PortfolioDetailsPageHeader
      portfolioName={portfolio.name}
      portfolioDescription={portfolio.description}
      portfolioCountryCode={portfolio.countryCode}
    >
      <YearSelector id={id} firstYear={portfolio.firstYear} />
      <CompaniesList companies={portfolio ? portfolio.companies : []} />
    </PortfolioDetailsPageHeader>
  );
}
