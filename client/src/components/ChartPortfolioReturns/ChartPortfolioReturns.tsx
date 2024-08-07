import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { LineChart } from "@mantine/charts";
import { Center, Stack, Title } from "@mantine/core";
import { IBenchmark } from "types/benchmark";
import { IPortfolioYearStats } from "types/portfolio-year-stats";

interface Props {
  data: IPortfolioYearStats[];
  indexData: IBenchmark;
}

export default function ChartPortfolioReturns({ data, indexData }: Props) {
  const { t } = useTranslation();
  const [chartData, setChartData] = useState<any>();

  const getSeries = () => {
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
  };

  useEffect(() => {
    if (data && data.length > 0) {
      const newYears: any = [];
      const returnsPercent: any = [];

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
          returnsPercent.push({
            year: year.year,
            returnsPercent: Number(year.returnPercent),
            returnWithDividendsPercent: Number(year.returnWithDividendsPercent),
            indexData: indexData
              ? indexData.years.find(
                  (indexItem: any) => indexItem.year === year.year,
                )?.returnPercentage
              : null,
          });
        }
      });

      setChartData(returnsPercent);
    }
  }, [data, indexData, t]);

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
          series={getSeries()}
          valueFormatter={(value) => `${value} %`}
        />
      </Stack>
    );
  }
  return null;
}
