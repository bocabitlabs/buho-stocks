import { useMemo } from "react";
import { PieChart } from "@mantine/charts";
import { IPortfolioYearStats } from "types/portfolio-year-stats";
import { getColorShade } from "utils/colors";

interface ChartProps {
  data: IPortfolioYearStats[];
  currency: string;
  width: number;
}

interface ItemProps {
  name: string;
  label: string;
  value: number;
  color: string;
}

export default function ChartDividendsByCompany({
  data,
  currency,
  width,
}: ChartProps) {
  const filteredData = useMemo(
    function createChartData() {
      const companies: {
        name: string;
        label: string;
        value: number;
        color: string;
      }[] = [];

      data.forEach((stat: IPortfolioYearStats) => {
        companies.push({
          name: stat.company.ticker.replace(".", ""),
          label: stat.company.ticker,
          value: Number(stat.accumulatedDividends),
          color: getColorShade(stat.company.ticker),
        });
      });
      companies.sort((a, b) => b.value - a.value);

      return companies;
    },
    [data],
  );

  if (data) {
    return (
      <PieChart
        withLabelsLine
        labelsPosition="inside"
        labelsType="percent"
        valueFormatter={(value: number) => `${value} ${currency}`}
        tooltipProps={{
          label: (item: ItemProps) => {
            console.log(item);
            return item.label;
          },
        }}
        withLabels
        data={filteredData}
        withTooltip
        tooltipDataSource="segment"
        startAngle={90}
        endAngle={-270}
        size={width}
      />
    );
  }
  return null;
}
