import { useContext } from "react";
import { Grid, Loader } from "@mantine/core";
import SectorsListTable from "./components/SectorsListTable/SectorsListTable";
import SectorsPageHeader from "./components/SectorsPageHeader/SectorsPageHeader";
import {
  LanguageContext,
  LanguageProvider,
} from "components/ListLanguageProvider/ListLanguageProvider";

function SectorsListTableContent() {
  const mrtLocalization = useContext(LanguageContext);

  return mrtLocalization ? (
    <SectorsListTable mrtLocalization={mrtLocalization} />
  ) : (
    <Loader />
  );
}

export function SectorsListPage() {
  return (
    <Grid p={20}>
      <Grid.Col span={12}>
        <SectorsPageHeader />
      </Grid.Col>
      <Grid.Col span={12}>
        <LanguageProvider>
          <SectorsListTableContent />
        </LanguageProvider>
      </Grid.Col>
    </Grid>
  );
}

export default SectorsListPage;
