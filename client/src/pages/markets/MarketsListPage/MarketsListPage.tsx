import { Grid } from "@mantine/core";
import MarketsListTable from "./components/MarketsListTable/MarketsListTable";
import MarketsPageHeader from "./components/MarketsPageHeader/MarketsPageHeader";

export default function MarketsListPage() {
  return (
    <Grid p={20}>
      <Grid.Col span={12}>
        <MarketsPageHeader />
      </Grid.Col>
      <Grid.Col span={12}>
        <MarketsListTable />
      </Grid.Col>
    </Grid>
  );
}
