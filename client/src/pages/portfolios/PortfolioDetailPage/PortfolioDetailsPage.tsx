import React from "react";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";
import { Alert } from "antd";
import CompaniesList from "./components/CompaniesList/CompaniesList";
import PortfolioDetailsPageHeader from "./components/PortfolioDetailsPageHeader/PortfolioDetailsPageHeader";
import YearSelector from "./components/YearSelector/YearSelector";
import LoadingSpin from "components/LoadingSpin/LoadingSpin";
import { usePortfolio } from "hooks/use-portfolios/use-portfolios";

export default function PortfolioDetailsPage() {
  const { id } = useParams();
  const { t } = useTranslation();

  const { data: portfolio, error } = usePortfolio(+id!);

  if (!portfolio) {
    return <LoadingSpin style={{ marginTop: 20 }} />;
  }

  if (error) {
    return (
      <Alert
        style={{ marginTop: 20 }}
        showIcon
        message={`${t("Unable to load portfolio")}`}
        description={error.message}
        type="error"
      />
    );
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
      <CompaniesList
        companies={portfolio ? portfolio.companies : []}
        portfolioBaseCurrency={portfolio.baseCurrency}
      />
    </PortfolioDetailsPageHeader>
  );
}
