import { Grid } from "@mantine/core";
import StockPricesListTable from "./components/StockPricesListTable/StockPricesListTable";
import StockPricesPageHeader from "./components/StockPricesPageHeader/StockPricesPageHeader";

export default function ExchangeRatesListPage() {
  return (
    <Grid p={20}>
      <Grid.Col span={12}>
        <StockPricesPageHeader />
      </Grid.Col>
      <Grid.Col span={12}>
        <StockPricesListTable />
      </Grid.Col>
    </Grid>
  );
}
