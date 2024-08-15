import { useMemo } from "react";
import { BarChart } from "@mantine/charts";
import i18next from "i18next";
import { IPortfolioYearStats } from "types/portfolio-year-stats";

interface ChartProps {
  data: IPortfolioYearStats[];
  currency: string | undefined;
}

export default function ChartValueByCompany({ data, currency }: ChartProps) {
  const { resolvedLanguage } = i18next;

  const numberFormatter = new Intl.NumberFormat(resolvedLanguage, {
    style: "decimal",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  const filteredData = useMemo(
    function createChartData() {
      const filteredStats: IPortfolioYearStats[] = data.filter(
        (item: IPortfolioYearStats) => {
          return item.sharesCount > 0;
        },
      );

      const companies: {
        company: string;
        value: number;
      }[] = [];

      filteredStats.forEach((stat) => {
        companies.push({
          company: stat.company.ticker,
          value: Number(stat.portfolioValue),
        });
      });

      companies.sort((a, b) => b.value - a.value);
      return companies;
    },
    [data],
  );

  return (
    <BarChart
      h={400}
      data={filteredData}
      dataKey="company"
      series={[{ name: "value", color: "red" }]}
      valueFormatter={(value: number) =>
        `${numberFormatter.format(value)} ${currency}`
      }
      xAxisProps={{
        angle: -45,
        interval: 0,
        textAnchor: "end",
        height: 50, // Increase height to avoid clipping the labels
        tickSize: 10,
        transform: "translate(-10, 0)",
      }}
    />
  );
}
