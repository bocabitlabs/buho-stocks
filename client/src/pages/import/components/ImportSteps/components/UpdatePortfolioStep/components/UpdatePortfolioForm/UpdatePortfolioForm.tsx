import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Grid, Title, Text, Button } from "@mantine/core";
import { IconCheck } from "@tabler/icons-react";
import { usePortfolio } from "hooks/use-portfolios/use-portfolios";
import { useUpdatePortfolioYearStats } from "hooks/use-stats/use-portfolio-stats";

interface Props {
  portfolioId: number | undefined;
  onPortfolioUpdated: () => void;
}

export default function TradesImportForm({
  portfolioId,
  onPortfolioUpdated,
}: Readonly<Props>) {
  const { t } = useTranslation();

  const { data: portfolio } = usePortfolio(portfolioId);
  const [formSent, setFormSent] = useState(false);
  const { mutate: updatePortfolioStats, isPending } =
    useUpdatePortfolioYearStats({
      onSuccess: () => {
        setFormSent(false);
      },
    });

  const updatePortfolioAction = () => {
    setFormSent(true);
    // Get current year
    const date = new Date();
    const selectedYear = date.getFullYear().toString();

    // Get the id of each company of the portfolio and store them in an array
    const companiesIds = portfolio?.companies.map((company) => company.id);

    updatePortfolioStats({
      portfolioId: portfolio?.id,
      year: selectedYear,
      updateApiPrice: true,
      companiesIds,
    });
    onPortfolioUpdated();
  };

  return (
    <Grid p={20}>
      <Grid.Col>
        <Title order={4}>{t("Update the portfolio")}</Title>
        <Text>{t("Do you want to update the portfolio?")}</Text>

        <Button
          mt="md"
          variant="filled"
          leftSection={formSent ? <IconCheck /> : null}
          loading={isPending}
          disabled={!portfolio || formSent}
          onClick={updatePortfolioAction}
        >
          {t("Update portfolio")}
        </Button>
      </Grid.Col>
    </Grid>
  );
}
