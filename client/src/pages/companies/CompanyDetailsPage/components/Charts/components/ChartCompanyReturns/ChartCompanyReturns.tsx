import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { LineChart } from "@mantine/charts";
import { Center, Stack, Title } from "@mantine/core";
import { CompanyYearStats } from "types/company-year-stats";

interface Props {
  stats: CompanyYearStats[];
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
      const newYears: number[] = [];
      const returnsPercent: {
        year: number;
        returnsPercent: number;
        returnWithDividendsPercent: number;
      }[] = [];

      stats.sort((a, b) => {
        if (a.year > b.year) {
          return 1;
        }
        if (a.year < b.year) {
          return -1;
        }
        return 0;
      });
      stats.forEach((year) => {
        if (!newYears.includes(year.year) && year.year !== 9999) {
          newYears.push(year.year);
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
