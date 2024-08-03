import { Grid, Paper } from "@mantine/core";
import ChartPortfolioDividends from "components/ChartPortfolioDividends/ChartPortfolioDividends";
import ChartPortfolioReturnsProvider from "components/ChartPortfolioReturns/ChartPortfolioReturnsProvider";

export default function Charts() {
  return (
    <Grid>
      <Grid.Col span={6}>
        <Paper p="lg" shadow="xs">
          <ChartPortfolioReturnsProvider />
        </Paper>
      </Grid.Col>
      <Grid.Col span={6}>
        <Paper p="lg" shadow="xs">
          <ChartPortfolioDividends />
        </Paper>
      </Grid.Col>
    </Grid>
  );
}
