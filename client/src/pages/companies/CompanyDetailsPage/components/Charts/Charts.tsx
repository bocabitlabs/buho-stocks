import { Grid, Paper } from "@mantine/core";
import ChartCompanyDividends from "./components/ChartCompanyDividends/ChartCompanyDividends";
import ChartCompanyReturns from "./components/ChartCompanyReturns/ChartCompanyReturns";

interface Props {
  stats: any[];
  portfolioCurrency: string;
}

export default function Charts({ stats, portfolioCurrency }: Props) {
  if (stats.length === 0) {
    return null;
  }
  return (
    <Grid>
      <Grid.Col span={{ base: 12, md: 6, lg: 6 }}>
        <Paper p="lg" shadow="xs">
          <ChartCompanyReturns stats={stats} />
        </Paper>
      </Grid.Col>
      <Grid.Col span={{ base: 12, md: 6, lg: 6 }}>
        <Paper p="lg" shadow="xs">
          <ChartCompanyDividends
            stats={stats}
            portfolioCurrency={portfolioCurrency}
          />
        </Paper>
      </Grid.Col>
    </Grid>
  );
}
