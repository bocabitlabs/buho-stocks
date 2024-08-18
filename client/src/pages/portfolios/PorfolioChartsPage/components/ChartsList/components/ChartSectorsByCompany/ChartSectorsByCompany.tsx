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

export default function ChartSectorsByCompany({ data, width }: ChartProps) {
  const { t } = useTranslation();

  const filteredData = useMemo(
    function createChartData() {
      const filteredStats: IPortfolioYearStats[] = data.filter(
        (item: IPortfolioYearStats) => {
          return item.sharesCount > 0;
        },
      );
      const sectors: { name: string; value: number; color: string }[] = [];

      const groupedBySectorName = groupByName(filteredStats, "sectorName");

      Object.entries(groupedBySectorName).forEach(
        ([sectorName, statsArray]) => {
          sectors.push({
            name: t(sectorName),
            value: statsArray.length,
            color: getColorShade(sectorName),
          });
        },
      );
      // Sort the sectors by value
      sectors.sort((a, b) => b.value - a.value);
      return sectors;
    },
    [data, t],
  );

  return (
    <PieChart
      withLabelsLine
      labelsPosition="outside"
      labelsType="value"
      withLabels
      data={filteredData}
      withTooltip
      tooltipDataSource="segment"
      startAngle={90}
      endAngle={-270}
      size={width}
      valueFormatter={(value: number) => `${value} ${t("companies")}`}
    />
  );
}
