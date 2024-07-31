import { useParams } from "react-router-dom";
import { Grid } from "@mantine/core";
import LogMessagesList from "./components/LogMessagesList/LogMessagesList";
import PortfolioTransactionsLogPageHeader from "./components/PortfolioTransactionsLogPageHeader/PortfolioTransactionsLogPageHeader";
import LoadingSpin from "components/LoadingSpin/LoadingSpin";
import { usePortfolio } from "hooks/use-portfolios/use-portfolios";

export default function PortfolioDetailsPage() {
  const { id } = useParams();
  const { data: portfolio } = usePortfolio(+id!);

  if (!portfolio) {
    return <LoadingSpin />;
  }
  return (
    <Grid p={20}>
      <Grid.Col span={12}>
        <PortfolioTransactionsLogPageHeader portfolioName={portfolio.name} />
      </Grid.Col>
      <Grid.Col span={12}>
        <LogMessagesList />
      </Grid.Col>
    </Grid>
  );
}
