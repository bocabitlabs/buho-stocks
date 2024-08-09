import { useContext } from "react";
import { useParams } from "react-router-dom";
import { Grid, Loader } from "@mantine/core";
import LogMessagesList from "./components/LogMessagesList/LogMessagesList";
import PortfolioTransactionsLogPageHeader from "./components/PortfolioTransactionsLogPageHeader/PortfolioTransactionsLogPageHeader";
import {
  LanguageContext,
  LanguageProvider,
} from "components/ListLanguageProvider/ListLanguageProvider";
import LoadingSpin from "components/LoadingSpin/LoadingSpin";
import { usePortfolio } from "hooks/use-portfolios/use-portfolios";

function LogMessagesListContent() {
  const mrtLocalization = useContext(LanguageContext);

  return mrtLocalization ? (
    <LogMessagesList mrtLocalization={mrtLocalization} />
  ) : (
    <Loader />
  );
}

export default function PortfolioLogTransactionsPage() {
  const { id } = useParams();
  const { data: portfolio } = usePortfolio(+id!);

  if (!portfolio) {
    return <LoadingSpin />;
  }
  return (
    <Grid p={20}>
      <Grid.Col span={12}>
        <PortfolioTransactionsLogPageHeader portfolioName={portfolio.name} />
      </Grid.Col>
      <Grid.Col span={12}>
        <LanguageProvider>
          <LogMessagesListContent />
        </LanguageProvider>
      </Grid.Col>
    </Grid>
  );
}
