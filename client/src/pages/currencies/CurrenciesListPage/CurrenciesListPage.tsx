import { useContext } from "react";
import { Grid, Loader } from "@mantine/core";
import CurrenciesListTable from "./components/CurrenciesListTable/CurrenciesListTable";
import CurrenciesPageHeader from "./components/CurrenciesPageHeader/CurrenciesPageHeader";
import {
  LanguageContext,
  LanguageProvider,
} from "components/ListLanguageProvider/ListLanguageProvider";

function CurrenciesListTableContent() {
  const mrtLocalization = useContext(LanguageContext);

  return mrtLocalization ? (
    <CurrenciesListTable mrtLocalization={mrtLocalization} />
  ) : (
    <Loader />
  );
}

export default function CurrenciesListPage() {
  return (
    <Grid p={20}>
      <Grid.Col span={12}>
        <CurrenciesPageHeader />
      </Grid.Col>
      <Grid.Col span={12}>
        <LanguageProvider>
          <CurrenciesListTableContent />
        </LanguageProvider>
      </Grid.Col>
    </Grid>
  );
}
