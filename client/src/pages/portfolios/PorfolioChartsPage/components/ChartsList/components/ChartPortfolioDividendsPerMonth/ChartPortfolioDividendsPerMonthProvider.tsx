import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";
import { Center, Loader, Stack, Title } from "@mantine/core";
import ChartPortfolioDividendsPerMonth from "./ChartPortfolioDividendsPerMonth";
import { usePortfolio } from "hooks/use-portfolios/use-portfolios";
import { usePortfolioYearStatsByMonth } from "hooks/use-stats/use-portfolio-stats";

export default function ChartPortfolioDividendsPerMonthProvider() {
  const { t } = useTranslation();
  const { id } = useParams();
  const {
    data: portfolio,
    isError: isErrorPortfolio,
    isLoading: isLoadingPortfolio,
    error: errorPortfolio,
  } = usePortfolio(+id!);

  const {
    data: statsData,
    isLoading,
    isError,
    error,
  } = usePortfolioYearStatsByMonth(+id!, "all");

  if (isLoading || isLoadingPortfolio) {
    return <Loader />;
  }
  if (isError || isErrorPortfolio) {
    return (
      <div>
        {error?.message ? error.message : t("An error occurred")}
        {errorPortfolio?.message
          ? errorPortfolio.message
          : t("An error occurred")}
      </div>
    );
  }

  if (statsData && portfolio) {
    return (
      <Stack>
        <Center>
          <Title order={5}>{t("Portfolio Dividends per month")}</Title>
        </Center>
        <Center>
          <ChartPortfolioDividendsPerMonth
            data={statsData}
            currency={portfolio.baseCurrency.code}
          />
        </Center>
      </Stack>
    );
  }
  return null;
}
