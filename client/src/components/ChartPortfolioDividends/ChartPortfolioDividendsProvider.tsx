import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";
import { Loader, Text } from "@mantine/core";
import { AxiosError } from "axios";
import ChartPortfolioDividends from "./ChartPortfolioDividends";
import { usePortfolio } from "hooks/use-portfolios/use-portfolios";
import { usePortfolioAllYearStats } from "hooks/use-stats/use-portfolio-stats";

export default function ChartPortfolioDividendsProvider() {
  const { t } = useTranslation();
  const { id } = useParams();

  const { data, isLoading, isError, error } = usePortfolioAllYearStats(+id!);
  const {
    data: portfolio,
    isError: isErrorPortfolio,
    isLoading: isLoadingPortfolio,
    error: errorPortfolio,
  } = usePortfolio(+id!);

  if (isError || isErrorPortfolio) {
    if ((error as AxiosError)?.response?.status === 404) {
      return (
        <Text>{t("Not enough portfolio data yet to generate charts.")}</Text>
      );
    }
    return (
      <Text>
        {error && error.message} {errorPortfolio && errorPortfolio.message}
      </Text>
    );
  }

  if (isLoading || isLoadingPortfolio) {
    return <Loader data-testid="loader" />;
  }

  if (data && portfolio) {
    return (
      <ChartPortfolioDividends
        data={data}
        baseCurrencyCode={portfolio.baseCurrency.code}
      />
    );
  }
  return <Text>{t("Not enough portfolio data yet to generate charts.")}</Text>;
}
