import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";
import { Center, Loader, Stack, Title } from "@mantine/core";
import ChartInvestedByCompanyYearly from "./ChartInvestedByCompanyYearly";
import { usePortfolioYearStatsByCompany } from "hooks/use-stats/use-portfolio-stats";

type Props = { selectedYear: string; currency: string };

export default function ChartInvestedByCompanyYearlyProvider({
  selectedYear,
  currency,
}: Props) {
  const { id } = useParams();
  const { t } = useTranslation();

  const {
    data: statsData,
    isLoading,
    isError,
    error,
  } = usePortfolioYearStatsByCompany(+id!, selectedYear);

  if (isLoading) {
    return <Loader />;
  }
  if (isError) {
    return <div>{error.message ? error.message : t("An error occurred")}</div>;
  }

  if (statsData) {
    return (
      <Stack>
        <Center>
          <Title order={5}>{t("Invested by company yearly")}</Title>
        </Center>
        <Center>
          <ChartInvestedByCompanyYearly data={statsData} currency={currency} />
        </Center>
      </Stack>
    );
  }
  return null;
}
