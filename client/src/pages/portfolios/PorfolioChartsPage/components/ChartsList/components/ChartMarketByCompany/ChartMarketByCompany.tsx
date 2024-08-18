import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { PieChart } from "@mantine/charts";
import { IPortfolioYearStats } from "types/portfolio-year-stats";
import { getColorShade } from "utils/colors";
import { groupByName } from "utils/grouping";

interface ChartProps {
  data: IPortfolioYearStats[];
  width: number;
}

export default function ChartMarketByCompany({ data, width }: ChartProps) {
  const { t } = useTranslation();

  const filteredData = useMemo(
    function createChartData() {
      const filteredCompanies: IPortfolioYearStats[] = data.filter(
        (item: IPortfolioYearStats) => {
          return item.sharesCount > 0;
        },
      );

      const markets: { name: string; value: number; color: string }[] = [];

      const groupedByMarketName = groupByName(filteredCompanies, "marketName");
      Object.entries(groupedByMarketName).forEach(([year, statsArray]) => {
        markets.push({
          name: year,
          value: statsArray.length,
          color: getColorShade(year),
        });
      });
      markets.sort((a, b) => b.value - a.value);

      return markets;
    },
    [data],
  );

  return (
    <PieChart
      withLabelsLine
      labelsPosition="outside"
      labelsType="value"
      withLabels
      data={filteredData}
      withTooltip
      startAngle={90}
      endAngle={-270}
      size={width}
      valueFormatter={(value: number) => `${value} ${t("companies")}`}
    />
  );
}
