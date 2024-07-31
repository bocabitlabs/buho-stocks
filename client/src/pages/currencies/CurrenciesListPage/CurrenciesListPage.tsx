import { Grid } from "@mantine/core";
import CurrenciesListTable from "./components/CurrenciesListTable/CurrenciesListTable";
import CurrenciesPageHeader from "./components/CurrenciesPageHeader/CurrenciesPageHeader";

export default function CurrenciesListPage() {
  return (
    <Grid p={20}>
      <Grid.Col span={12}>
        <CurrenciesPageHeader />
      </Grid.Col>
      <Grid.Col span={12}>
        <CurrenciesListTable />
      </Grid.Col>
    </Grid>
  );
}
