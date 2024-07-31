import { Grid } from "@mantine/core";
import ExchangeRatesListTable from "./components/ExchangeRatesListTable/ExchangeRatesListTable";
import ExchangeRatesPageHeader from "./components/ExchangeRatesPageHeader/ExchangeRatesPageHeader";

export default function ExchangeRatesListPage() {
  return (
    <Grid p={20}>
      <Grid.Col span={12}>
        <ExchangeRatesPageHeader />
      </Grid.Col>
      <Grid.Col span={12}>
        <ExchangeRatesListTable />
      </Grid.Col>
    </Grid>
  );
}
