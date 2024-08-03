import { useTranslation } from "react-i18next";
import { Grid, NumberFormatter, Stack, Text } from "@mantine/core";
import { IconArrowDown, IconArrowUp } from "@tabler/icons-react";
import { CompanyYearStats } from "types/company-year-stats";

interface Props {
  stats: CompanyYearStats;
  stockPrice: any;
}

export default function StatsContent({ stats, stockPrice }: Props) {
  const { t } = useTranslation();

  return (
    <Grid>
      <Grid.Col span={3}>
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
          <Text c="dimmed">
            {stats?.sharesCount} {t("shares")}
          </Text>
        </Stack>
      </Grid.Col>
      <Grid.Col span={3}>
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
      <Grid.Col span={3}>
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
          <Text c="dimmed">
            {t("Accum.")} {stats?.accumulatedDividends}{" "}
            {stats?.portfolioCurrency}
          </Text>
        </Stack>
      </Grid.Col>
      <Grid.Col span={3}>
        <Stack gap="xs">
          <Text>{t("Dividends yield")}</Text>
          <Text size="xl">
            <NumberFormatter
              suffix=" %"
              value={stats.dividendsYield ?? 0}
              thousandSeparator
              decimalScale={2}
            />
          </Text>
        </Stack>
      </Grid.Col>
      <Grid.Col span={3}>
        <Stack gap="xs">
          <Text>{t("Portfolio value")}</Text>
          <Text
            size="xl"
            c={
              stats.portfolioValue < stats.accumulatedInvestment
                ? "#cf1322"
                : ""
            }
          >
            <NumberFormatter
              suffix={` ${stats.portfolioCurrency}`}
              value={stats.portfolioValue}
              thousandSeparator
              decimalScale={2}
            />
          </Text>
        </Stack>
      </Grid.Col>
      <Grid.Col span={3}>
        <Stack gap="xs">
          <Text>{t("Return")}</Text>
          <Text size="xl" c={+stats.returnValue < 0 ? "#cf1322" : ""}>
            <NumberFormatter
              suffix={` ${stats.portfolioCurrency}`}
              value={stats.returnValue}
              thousandSeparator
              decimalScale={2}
            />
          </Text>
          <Text c={+stats.returnPercent < 0 ? "red" : "green"}>
            {+stats.returnValue < 0 ? <IconArrowDown /> : <IconArrowUp />}
            <NumberFormatter
              suffix={` %`}
              value={stats.returnPercent}
              thousandSeparator
              decimalScale={2}
            />
          </Text>
        </Stack>
      </Grid.Col>
      <Grid.Col span={3}>
        <Stack gap="xs">
          <Text>{t("Return + dividends")}</Text>
          <Text size="xl" c={+stats.returnWithDividends < 0 ? "#cf1322" : ""}>
            <NumberFormatter
              suffix={` ${stats.portfolioCurrency}`}
              value={stats.returnWithDividends}
              thousandSeparator
              decimalScale={2}
            />
          </Text>
          <Text c={+stats.returnWithDividendsPercent < 0 ? "red" : "green"}>
            {+stats.returnWithDividends < 0 ? (
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
      <Grid.Col span={3}>
        <Stack gap="xs">
          <Text>{t("Last stock price")}</Text>
          <Text size="xl">
            <NumberFormatter
              suffix={` ${stockPrice.priceCurrency}`}
              value={stockPrice.price}
              thousandSeparator
              decimalScale={2}
            />
          </Text>
          <Text c="dimmed">{stockPrice.transactionDate}</Text>
        </Stack>
      </Grid.Col>
    </Grid>
  );
}
