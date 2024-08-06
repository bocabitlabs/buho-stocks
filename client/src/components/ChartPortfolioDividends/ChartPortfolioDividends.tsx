import React, { ReactElement, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";
import { BarChart } from "@mantine/charts";
import { Center, Loader, Stack, Title } from "@mantine/core";
import { AxiosError } from "axios";
import i18next from "i18next";
import { usePortfolio } from "hooks/use-portfolios/use-portfolios";
import { usePortfolioAllYearStats } from "hooks/use-stats/use-portfolio-stats";

export default function ChartPortfolioDividends(): ReactElement | null {
  const { t } = useTranslation();
  const { id } = useParams();
  const [chartData, setChartData] = React.useState<any>(null);
  const { data, isFetching, error } = usePortfolioAllYearStats(+id!);
  const { data: portfolio } = usePortfolio(+id!);

  const { resolvedLanguage } = i18next;

  const numberFormatter = new Intl.NumberFormat(resolvedLanguage, {
    style: "decimal",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  useEffect(() => {
    if (data && data.length > 0) {
      const newYears: any = [];
      const dividends: any = [];
      const dividendsPerYear: any = [];

      data.sort((a: any, b: any) => {
        if (a.year > b.year) {
          return 1;
        }
        if (a.year < b.year) {
          return -1;
        }
        return 0;
      });
      data.forEach((year: any) => {
        if (
          !newYears.includes(year.year) &&
          year.year !== "all" &&
          year.year !== 9999
        ) {
          newYears.push(year.year);
          dividends.push(Number(year.dividends));
          dividendsPerYear.push({
            year: year.year,
            value: Number(year.dividends),
          });
        }
      });

      // Sort the sectors by value
      dividendsPerYear.sort((a, b) => a.year - b.year);

      setChartData(dividendsPerYear);
    }
  }, [data, t]);

  if (error) {
    if ((error as AxiosError)?.response?.status === 404) {
      return <div>No stats yet</div>;
    }
    return <div>Something went wrong</div>;
  }

  if (isFetching) {
    return <Loader data-testid="loader" />;
  }

  if (chartData && portfolio) {
    return (
      <Stack>
        <Center>
          <Title order={5}>{t("Portfolio Dividends")}</Title>
        </Center>
        <Center>
          <BarChart
            h={400}
            data={chartData}
            dataKey="year"
            series={[{ name: "value", color: "red" }]}
            valueFormatter={(value: number) =>
              `${numberFormatter.format(value)} ${portfolio.baseCurrency.code}`
            }
            xAxisProps={{
              interval: 0,
              textAnchor: "end",
              height: 50, // Increase height to avoid clipping the labels
              tick: {
                style: { fontSize: 10 },
                transform: "translate(-10, 0)", // Adjust label position
              },
            }}
          />
        </Center>
      </Stack>
    );
  }
  return <Loader data-testid="loader" />;
}
