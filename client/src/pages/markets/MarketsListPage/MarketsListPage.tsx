import { useContext } from "react";
import { Grid, Loader } from "@mantine/core";
import MarketsListTable from "./components/MarketsListTable/MarketsListTable";
import MarketsPageHeader from "./components/MarketsPageHeader/MarketsPageHeader";
import {
  LanguageContext,
  LanguageProvider,
} from "components/ListLanguageProvider/ListLanguageProvider";

function MarketsListContent() {
  const mrtLocalization = useContext(LanguageContext);

  return mrtLocalization ? (
    <MarketsListTable mrtLocalization={mrtLocalization} />
  ) : (
    <Loader />
  );
}

export default function MarketsListPage() {
  return (
    <Grid p={20}>
      <Grid.Col span={12}>
        <MarketsPageHeader />
      </Grid.Col>
      <Grid.Col span={12}>
        <LanguageProvider>
          <MarketsListContent />
        </LanguageProvider>
      </Grid.Col>
    </Grid>
  );
}
