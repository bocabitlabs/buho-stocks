import { Grid, Paper } from "@mantine/core";
import DividendsChart from "../DividendsChart/DividendsChart";
import ReturnsChart from "../ReturnsChart/ReturnsChart";

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
      <Grid.Col span={6}>
        <Paper p="lg" shadow="xs">
          <ReturnsChart stats={stats} />
        </Paper>
      </Grid.Col>
      <Grid.Col span={6}>
        <Paper p="lg" shadow="xs">
          <DividendsChart stats={stats} portfolioCurrency={portfolioCurrency} />
        </Paper>
      </Grid.Col>
    </Grid>
  );
}
