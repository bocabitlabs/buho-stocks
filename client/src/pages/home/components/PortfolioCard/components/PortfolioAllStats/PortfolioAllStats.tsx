import { useTranslation } from "react-i18next";
import { Center, Group, Text } from "@mantine/core";
import { IconArrowDown, IconArrowUp } from "@tabler/icons-react";
import i18next from "i18next";
import { usePortfolioYearStats } from "hooks/use-stats/use-portfolio-stats";

interface Props {
  portfolioId: number;
}

export default function PortfolioAllStats({ portfolioId }: Readonly<Props>) {
  const {
    data: stats,
    isLoading,
    error,
  } = usePortfolioYearStats(portfolioId, "all");
  const { t } = useTranslation();
  const { resolvedLanguage } = i18next;

  const numberFormatter = new Intl.NumberFormat(resolvedLanguage, {
    style: "decimal",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  if (isLoading) {
    return <div>{t("Loading...")}</div>;
  }

  if (error) {
    return (
      <div>
        {t("Error:")} {error.message}
      </div>
    );
  }

  if (!stats) {
    return (
      <div>{t("No stats yet. Start adding companies and transactions.")}</div>
    );
  }
  return (
    <div>
      <Text size="2em" fw={600}>
        {stats && numberFormatter.format(stats.portfolioValue)}{" "}
        {stats?.portfolioCurrency}
      </Text>
      <Group>
        <Text c={stats && stats?.returnWithDividends <= 0 ? "red" : "green"}>
          {stats?.returnWithDividends
            ? numberFormatter.format(stats.returnWithDividends)
            : numberFormatter.format(0)}{" "}
          {stats?.portfolioCurrency}
        </Text>{" "}
        {" / "}
        <Text
          c={stats && stats?.returnWithDividendsPercent <= 0 ? "red" : "green"}
        >
          <Center>
            {Number(stats?.portfolioValue) <=
            Number(stats?.accumulatedInvestment) ? (
              <IconArrowDown />
            ) : (
              <IconArrowUp />
            )}{" "}
            {stats?.returnWithDividendsPercent
              ? numberFormatter.format(stats?.returnWithDividendsPercent)
              : numberFormatter.format(0)}
            %
          </Center>
        </Text>
      </Group>
    </div>
  );
}
