import { useContext } from "react";
import { Grid, Loader } from "@mantine/core";
import BenchmarksListPageHeader from "./components/BenchmarksListPageHeader/BenchmarksListPageHeader";
import BenchmarksListTable from "./components/BenchmarksListTable/BenchmarksListTable";
import {
  LanguageContext,
  LanguageProvider,
} from "components/ListLanguageProvider/ListLanguageProvider";

function BenchmarksListContent() {
  const mrtLocalization = useContext(LanguageContext);

  return mrtLocalization ? (
    <BenchmarksListTable mrtLocalization={mrtLocalization} />
  ) : (
    <Loader />
  );
}

export default function BenchmarksListPage() {
  return (
    <Grid p={20}>
      <Grid.Col span={12}>
        <BenchmarksListPageHeader />
      </Grid.Col>
      <Grid.Col span={12}>
        <LanguageProvider>
          <BenchmarksListContent />
        </LanguageProvider>
      </Grid.Col>
    </Grid>
  );
}
