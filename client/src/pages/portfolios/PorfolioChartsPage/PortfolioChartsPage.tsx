import { useParams } from "react-router-dom";
import { Grid, Loader } from "@mantine/core";
import ChartsList from "./components/ChartsList/ChartsList";
import PortfolioChartsPageHeader from "./components/PortfolioChartsPageHeader/PortfolioChartsPageHeader";
import { usePortfolio } from "hooks/use-portfolios/use-portfolios";

export default function PortfolioChartsPage() {
  const { id } = useParams();
  const { data: portfolio } = usePortfolio(+id!);

  if (!portfolio) {
    return <Loader />;
  }
  return (
    <Grid p={20}>
      <Grid.Col span={12}>
        <PortfolioChartsPageHeader
          portfolioName={portfolio.name}
          portfolioCountryCode={portfolio.countryCode}
        />
      </Grid.Col>
      <Grid.Col span={12}>
        <ChartsList />
      </Grid.Col>
    </Grid>
  );
}
