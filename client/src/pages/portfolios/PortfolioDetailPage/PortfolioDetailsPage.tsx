import { useContext } from "react";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";
import { Alert, Loader, Grid } from "@mantine/core";
import CompaniesList from "./components/CompaniesList/CompaniesList";
import PortfolioCharts from "./components/PortfolioCharts/PortfolioCharts";
import PortfolioDetailsPageHeader from "./components/PortfolioDetailsPageHeader/PortfolioDetailsPageHeader";
import PortfolioStatsProvider from "./components/PortfolioStats/PortfolioStatsProvider";
import {
  LanguageContext,
  LanguageProvider,
} from "components/ListLanguageProvider/ListLanguageProvider";
import { usePortfolio } from "hooks/use-portfolios/use-portfolios";

function CompaniesListContent({ portfolioId }: { portfolioId: string }) {
  const mrtLocalization = useContext(LanguageContext);

  return mrtLocalization ? (
    <CompaniesList
      portfolioId={portfolioId}
      mrtLocalization={mrtLocalization}
    />
  ) : (
    <Loader />
  );
}

export function PortfolioDetailsPage() {
  const { id } = useParams();
  const { t } = useTranslation();

  const { data: portfolio, error } = usePortfolio(+id!);

  if (!portfolio) {
    return <Loader />;
  }

  if (error) {
    return (
      <Alert
        style={{ marginTop: 20 }}
        title={t("Unable to load portfolio")}
        color="red"
      >
        {error.message}
      </Alert>
    );
  }

  return (
    <Grid p={20}>
      <Grid.Col span={12}>
        <PortfolioDetailsPageHeader
          portfolioName={portfolio.name}
          portfolioDescription={portfolio.description}
          portfolioCountryCode={portfolio.countryCode}
        />
      </Grid.Col>
      <Grid.Col span={12}>
        {id && (
          <PortfolioStatsProvider
            portfolioId={id}
            firstYear={portfolio.firstYear}
          />
        )}
      </Grid.Col>
      <Grid.Col span={12}>
        <PortfolioCharts />
      </Grid.Col>
      <Grid.Col span={12}>
        {id && (
          <LanguageProvider>
            <CompaniesListContent portfolioId={id} />
          </LanguageProvider>
        )}
      </Grid.Col>
    </Grid>
  );
}

export default PortfolioDetailsPage;
