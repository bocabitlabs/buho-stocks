import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { LineChart } from "@mantine/charts";
import { Center, Stack, Title } from "@mantine/core";

interface Props {
  stats: any;
}

export default function ChartCompanyReturns({ stats }: Props) {
  const { t } = useTranslation();

  const series = [
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

  const chartData = useMemo(() => {
    if (stats) {
      const newYears: any = [];
      const returnsPercent: any = [];

      stats.sort((a: any, b: any) => {
        if (a.year > b.year) {
          return 1;
        }
        if (a.year < b.year) {
          return -1;
        }
        return 0;
      });
      stats.forEach((year: any) => {
        if (
          !newYears.includes(year.year) &&
          year.year !== "all" &&
          year.year !== 9999
        ) {
          returnsPercent.push({
            year: year.year,
            returnsPercent: Number(year.returnPercent),
            returnWithDividendsPercent: Number(year.returnWithDividendsPercent),
          });
        }
      });

      return returnsPercent;
    }
  }, [stats]);

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
