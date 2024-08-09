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

export default function ChartSuperSectorsByCompany({
  data,
  width,
}: ChartProps) {
  const { t } = useTranslation();

  const filteredData = useMemo(
    function createChartData() {
      const filteredCompanies: any = data.filter((item: any) => {
        return item.sharesCount > 0;
      });
      const sectors: { name: string; value: number; color: string }[] = [];

      const res = groupByName(filteredCompanies, "superSectorName");

      Object.entries(res).forEach(([k, v]) => {
        sectors.push({
          name: t(k),
          value: (v as any[]).length,
          color: getColorShade(k),
        });
      });
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
      size={width}
      startAngle={90}
      endAngle={-270}
      valueFormatter={(value: number) => `${value} ${t("companies")}`}
    />
  );
}
