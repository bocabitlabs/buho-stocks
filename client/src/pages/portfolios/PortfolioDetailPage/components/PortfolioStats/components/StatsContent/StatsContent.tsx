import { useTranslation } from "react-i18next";
import { Grid, NumberFormatter, Stack, Text } from "@mantine/core";
import { IconArrowDown, IconArrowUp } from "@tabler/icons-react";
import { IPortfolioYearStats } from "types/portfolio-year-stats";

interface Props {
  stats: IPortfolioYearStats;
}

export default function StatsContent({ stats }: Props) {
  const { t } = useTranslation();

  return (
    <Grid>
      <Grid.Col span={{ base: 12, md: 6, lg: 3 }}>
        <Stack gap="xs">
          <Text>{t("Invested")}</Text>
          <Text size="xl">
            <NumberFormatter
              suffix={` ${stats.portfolioCurrency}`}
              value={stats.invested}
              thousandSeparator
              decimalScale={2}
            />
          </Text>
        </Stack>
      </Grid.Col>
      <Grid.Col span={{ base: 12, md: 6, lg: 3 }}>
        <Stack gap="xs">
          <Text>{t("Accum. investment")}</Text>
          <Text size="xl">
            <NumberFormatter
              suffix={` ${stats.portfolioCurrency}`}
              value={stats.accumulatedInvestment}
              thousandSeparator
              decimalScale={2}
            />
          </Text>
        </Stack>
      </Grid.Col>
      <Grid.Col span={{ base: 12, md: 6, lg: 3 }}>
        <Stack gap="xs">
          <Text>{t("Portfolio value")}</Text>
          <Text size="xl">
            <NumberFormatter
              suffix={` ${stats.portfolioCurrency}`}
              value={stats.portfolioValue}
              thousandSeparator
              decimalScale={2}
              style={{
                color:
                  Number(stats?.portfolioValue) <
                  Number(stats?.accumulatedInvestment)
                    ? "#cf1322"
                    : "",
              }}
            />
          </Text>
        </Stack>
      </Grid.Col>
      <Grid.Col span={{ base: 12, md: 6, lg: 3 }}>
        <Stack gap="xs">
          <Text>{t("Dividends")}</Text>
          <Text size="xl">
            <NumberFormatter
              suffix={` ${stats.portfolioCurrency}`}
              value={stats.dividends}
              thousandSeparator
              decimalScale={2}
            />
          </Text>
        </Stack>
      </Grid.Col>
      <Grid.Col span={{ base: 12, md: 6, lg: 3 }}>
        <Stack gap="xs">
          <Text>{t("Accum. Dividends")}</Text>
          <Text size="xl">
            <NumberFormatter
              suffix={` ${stats.portfolioCurrency}`}
              value={stats.accumulatedDividends}
              thousandSeparator
              decimalScale={2}
            />
          </Text>
        </Stack>
      </Grid.Col>
      <Grid.Col span={{ base: 12, md: 6, lg: 3 }}>
        <Stack gap="xs">
          <Text>{t("Dividends yield")}</Text>
          <Text size="xl">
            <NumberFormatter
              suffix={` %`}
              value={stats.dividendsYield ?? 0}
              thousandSeparator
              decimalScale={2}
            />
          </Text>
        </Stack>
      </Grid.Col>
      <Grid.Col span={{ base: 12, md: 6, lg: 3 }}>
        <Stack gap="xs">
          <Text>{t("Return")}</Text>
          <Text size="xl">
            <NumberFormatter
              suffix={` ${stats.portfolioCurrency}`}
              value={stats.returnValue}
              thousandSeparator
              decimalScale={2}
            />
          </Text>
          <Text c={stats?.returnPercent < 0 ? "red" : "green"}>
            {stats?.returnValue < 0 ? <IconArrowDown /> : <IconArrowUp />}
            <NumberFormatter
              suffix={` %`}
              value={stats.returnPercent}
              thousandSeparator
              decimalScale={2}
            />
          </Text>
        </Stack>
      </Grid.Col>
      <Grid.Col span={{ base: 12, md: 6, lg: 3 }}>
        <Stack gap="xs">
          <Text>{t("Return + dividends")}</Text>
          <Text size="xl">
            <NumberFormatter
              suffix={` ${stats.portfolioCurrency}`}
              value={stats.returnWithDividends}
              thousandSeparator
              decimalScale={2}
              color={stats?.returnWithDividends < 0 ? "red" : ""}
            />
          </Text>
          <Text c={stats?.returnWithDividendsPercent < 0 ? "red" : "green"}>
            {stats?.returnWithDividends < 0 ? (
              <IconArrowDown />
            ) : (
              <IconArrowUp />
            )}
            <NumberFormatter
              suffix={` %`}
              value={stats.returnWithDividendsPercent}
              thousandSeparator
              decimalScale={2}
            />
          </Text>
        </Stack>
      </Grid.Col>
    </Grid>
  );
}
