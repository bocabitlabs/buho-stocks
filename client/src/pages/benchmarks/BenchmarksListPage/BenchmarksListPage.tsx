import { Grid } from "@mantine/core";
import BenchmarksListPageHeader from "./components/BenchmarksListPageHeader/BenchmarksListPageHeader";
import BenchmarksListTable from "./components/BenchmarksListTable/BenchmarksListTable";

export default function BenchmarksListPage() {
  return (
    <Grid p={20}>
      <Grid.Col span={12}>
        <BenchmarksListPageHeader />
      </Grid.Col>
      <Grid.Col span={12}>
        <BenchmarksListTable />
      </Grid.Col>
    </Grid>
  );
}
