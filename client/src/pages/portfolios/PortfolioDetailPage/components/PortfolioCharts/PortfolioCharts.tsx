import { Grid } from "@mantine/core";
import ChartPortfolioDividends from "components/ChartPortfolioDividends/ChartPortfolioDividends";
import ChartPortfolioReturns from "components/ChartPortfolioReturns/ChartPortfolioReturns";

export default function Charts() {
  return (
    <Grid>
      <Grid.Col span={6}>
        <ChartPortfolioReturns />
      </Grid.Col>
      <Grid.Col span={6}>
        <ChartPortfolioDividends />
      </Grid.Col>
    </Grid>
  );
}
