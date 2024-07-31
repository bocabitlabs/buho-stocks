import { useTranslation } from "react-i18next";
import { ArrowDownOutlined, ArrowUpOutlined } from "@ant-design/icons";
import { Grid, NumberFormatter, Stack, Text } from "@mantine/core";
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
        {/* <Statistic
          title={t("Invested")}
          value={stats?.invested}
          precision={2}
          suffix={stats?.portfolioCurrency}
        />
        <Text type="secondary">
          {stats?.sharesCount} {t("shares")}
        </Text> */}
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
        {/* <Statistic
          title={t("Accum. investment")}
          value={stats?.accumulatedInvestment}
          precision={2}
          suffix={stats?.portfolioCurrency}
        /> */}
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
        {/* <Statistic
          title={t("Dividends")}
          value={stats?.dividends}
          precision={2}
          suffix={stats?.portfolioCurrency}
        />
        <Text type="secondary">
          {t("Accum.")} {stats?.accumulatedDividends} {stats?.portfolioCurrency}
        </Text> */}
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
        {/* <Statistic
          title={t("Dividends yield")}
          value={stats?.dividendsYield ? stats.dividendsYield : 0}
          precision={2}
          suffix="%"
        /> */}
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
        {/* <Statistic
          title={t("Portfolio value")}
          value={stats?.portfolioValue}
          valueStyle={{
            color:
              stats?.portfolioValue < stats?.accumulatedInvestment
                ? "#cf1322"
                : "",
          }}
          precision={2}
          suffix={stats?.portfolioCurrency}
        /> */}
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
            {+stats.returnValue < 0 ? (
              <ArrowDownOutlined />
            ) : (
              <ArrowUpOutlined />
            )}
            <NumberFormatter
              suffix={` %`}
              value={stats.returnPercent}
              thousandSeparator
              decimalScale={2}
            />
          </Text>
        </Stack>
        {/* <Statistic
          title={t("Return")}
          value={stats?.returnValue}
          precision={2}
          valueStyle={{
            color: stats?.returnValue < 0 ? "#cf1322" : "",
          }}
          suffix={stats?.portfolioCurrency}
        />
        <Text type={stats?.returnPercent < 0 ? "danger" : "success"}>
          {stats?.returnValue < 0 ? <ArrowDownOutlined /> : <ArrowUpOutlined />}
          {stats?.returnPercent ? Number(stats.returnPercent).toFixed(2) : ""}%
        </Text> */}
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
              <ArrowDownOutlined />
            ) : (
              <ArrowUpOutlined />
            )}
            <NumberFormatter
              suffix={` %`}
              value={stats.returnWithDividendsPercent}
              thousandSeparator
              decimalScale={2}
            />
          </Text>
        </Stack>
        {/* <Statistic
          title={t("Return + dividends")}
          value={stats?.returnWithDividends}
          precision={2}
          valueStyle={{
            color: stats?.returnWithDividends < 0 ? "#cf1322" : "",
          }}
          suffix={stats?.portfolioCurrency}
        />
        <Text
          type={stats?.returnWithDividendsPercent < 0 ? "danger" : "success"}
        >
          {stats?.returnWithDividends < 0 ? (
            <ArrowDownOutlined />
          ) : (
            <ArrowUpOutlined />
          )}
          {stats?.returnWithDividendsPercent
            ? Number(stats.returnWithDividendsPercent).toFixed(2)
            : ""}
          %
        </Text> */}
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
        {/* <Statistic
          title={t("Last stock price")}
          value={stockPrice?.price}
          precision={2}
          suffix={stockPrice?.priceCurrency}
        />
        <Text type="secondary">{stockPrice?.transactionDate}</Text> */}
      </Grid.Col>
    </Grid>
  );
}
