import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";
import { Alert, Switch } from "antd";
import CompaniesList from "./components/CompaniesList/CompaniesList";
import PortfolioDetailsPageHeader from "./components/PortfolioDetailsPageHeader/PortfolioDetailsPageHeader";
import YearSelector from "./components/YearSelector/YearSelector";
import LoadingSpin from "components/LoadingSpin/LoadingSpin";
import { useCompanies } from "hooks/use-companies/use-companies";
import { usePortfolio } from "hooks/use-portfolios/use-portfolios";
import { ICompanyListItem } from "types/company";

export default function PortfolioDetailsPage() {
  const { id } = useParams();
  const { t } = useTranslation();

  const { data: portfolio, error } = usePortfolio(+id!);
  const [filteredCompanies, setFilteredCompanies] = useState<
    ICompanyListItem[]
  >([]);
  const [showClosed, setShowClosed] = useState<boolean>(false);
  const { data: companies, isFetching: isFetchingCompanies } = useCompanies(
    +id!,
    showClosed,
  );
  useEffect(() => {
    if (companies) {
      const tempCompanies = companies.filter((company) => {
        return company.isClosed === showClosed;
      });
      setFilteredCompanies(tempCompanies);
    }
  }, [companies, showClosed]);

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
      <Switch
        checkedChildren={t("Displaying open companies")}
        unCheckedChildren={t("Displaying closed companies")}
        defaultChecked
        onChange={(checked: boolean) => setShowClosed(!checked)}
      />

      <CompaniesList
        companies={filteredCompanies}
        portfolioBaseCurrency={portfolio.baseCurrency}
        isFetching={isFetchingCompanies}
      />
    </PortfolioDetailsPageHeader>
  );
}
