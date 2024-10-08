import { Grid, Paper } from "@mantine/core";
import ChartPortfolioDividendsProvider from "components/ChartPortfolioDividends/ChartPortfolioDividendsProvider";
import ChartPortfolioReturnsProvider from "components/ChartPortfolioReturns/ChartPortfolioReturnsProvider";

export default function Charts() {
  return (
    <Grid>
      <Grid.Col span={{ base: 12, md: 6, lg: 6 }}>
        <Paper p="lg" shadow="xs">
          <ChartPortfolioReturnsProvider />
        </Paper>
      </Grid.Col>
      <Grid.Col span={{ base: 12, md: 6, lg: 6 }}>
        <Paper p="lg" shadow="xs">
          <ChartPortfolioDividendsProvider />
        </Paper>
      </Grid.Col>
    </Grid>
  );
}
