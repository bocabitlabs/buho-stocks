import { Grid } from "@mantine/core";
import SectorsListTable from "./components/SectorsListTable/SectorsListTable";
import SectorsPageHeader from "./components/SectorsPageHeader/SectorsPageHeader";

export default function SectorsListPage() {
  return (
    <Grid p={20}>
      <Grid.Col span={12}>
        <SectorsPageHeader />
      </Grid.Col>
      <Grid.Col span={12}>
        <SectorsListTable />
      </Grid.Col>
    </Grid>
  );
}
