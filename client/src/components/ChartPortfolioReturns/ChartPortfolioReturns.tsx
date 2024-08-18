import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { LineChart } from "@mantine/charts";
import { Center, Stack, Title } from "@mantine/core";
import { IBenchmark, IBenchmarkYear } from "types/benchmark";
import { IPortfolioYearStats } from "types/portfolio-year-stats";

interface Props {
  data: IPortfolioYearStats[];
  indexData: IBenchmark | undefined;
}

export default function ChartPortfolioReturns({ data, indexData }: Props) {
  const { t } = useTranslation();

  const series = useMemo(() => {
    const baseSeries = [
      {
        name: "returnsPercent",
        label: t<string>("Return"),
        color: "indigo.6",
      },
      {
        name: "returnWithDividendsPercent",
        label: t<string>("Return + dividends"),
        color: "teal.6",
      },
    ];
    if (indexData) {
      baseSeries.push({
        name: "indexData",
        label: indexData.name,
        color: "red.6",
      });
    }
    return baseSeries;
  }, [indexData, t]);

  const chartData = useMemo(() => {
    if (data && data.length > 0) {
      const newYears: number[] = [];
      const returnsPercent: {
        year: number;
        returnsPercent: number;
        returnWithDividendsPercent: number;
        indexData: number | null | undefined;
      }[] = [];

      data.sort((a: IPortfolioYearStats, b: IPortfolioYearStats) => {
        if (a.year > b.year) {
          return 1;
        }
        if (a.year < b.year) {
          return -1;
        }
        return 0;
      });
      data.forEach((year: IPortfolioYearStats) => {
        if (!newYears.includes(year.year) && year.year !== 9999) {
          returnsPercent.push({
            year: year.year,
            returnsPercent: Number(year.returnPercent),
            returnWithDividendsPercent: Number(year.returnWithDividendsPercent),
            indexData: indexData
              ? indexData.years.find(
                  (indexItem: IBenchmarkYear) => indexItem.year === year.year,
                )?.returnPercentage
              : null,
          });
        }
      });
      return returnsPercent;
    }
  }, [data, indexData]);

  if (chartData) {
    return (
      <Stack>
        <Center>
          <Title order={5}>{t("Return per year")}</Title>
        </Center>
        <Center />
        <LineChart
          h={300}
          data={chartData}
          dataKey="year"
          withLegend
          series={series}
          valueFormatter={(value) => `${value} %`}
        />
      </Stack>
    );
  }
  return null;
}
