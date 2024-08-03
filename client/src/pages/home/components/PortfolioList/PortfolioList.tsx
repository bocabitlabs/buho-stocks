import { ReactElement } from "react";
import { useTranslation } from "react-i18next";
import { Alert, Grid } from "@mantine/core";
import { IconAlertTriangle } from "@tabler/icons-react";
import PortfolioCard from "../PortfolioCard/PortfolioCard";
import LoadingSpin from "components/LoadingSpin/LoadingSpin";
import { usePortfolios } from "hooks/use-portfolios/use-portfolios";

export default function PortfolioList(): ReactElement {
  const { t } = useTranslation();
  const { isFetching, data: portfolios, error } = usePortfolios();
  const icon = <IconAlertTriangle />;

  if (isFetching) {
    return <LoadingSpin />;
  }

  if (error) {
    return (
      <Alert
        icon={icon}
        title={t("Unable to load portfolios")}
        variant="filled"
        color="red"
      >
        {error.message}
      </Alert>
    );
  }

  return (
    <Grid>
      {portfolios?.map((portfolio) => (
        <Grid.Col span={4} key={portfolio.id}>
          <PortfolioCard key={portfolio.id} portfolio={portfolio} />
        </Grid.Col>
      ))}
    </Grid>
  );
}
