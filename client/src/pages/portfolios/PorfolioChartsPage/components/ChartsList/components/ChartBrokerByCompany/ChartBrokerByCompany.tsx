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

export default function ChartBrokerByCompany({ data, width }: ChartProps) {
  const { t } = useTranslation();

  const filteredData = useMemo(
    function createChartData() {
      const filteredCompanies: any = data.filter((item: any) => {
        return item.sharesCount > 0;
      });

      const brokers: {
        name: string;
        value: number;
        color: string;
      }[] = [];

      const res = groupByName(filteredCompanies, "broker");

      Object.entries(res).forEach(([k, v]) => {
        brokers.push({
          name: k,
          value: (v as any[]).length,
          color: getColorShade(k),
        });
      });
      brokers.sort((a, b) => b.value - a.value);

      return brokers;
    },
    [data],
  );

  return (
    <PieChart
      withLabelsLine
      labelsPosition="outside"
      labelsType="value"
      withLabels
      withTooltip
      startAngle={90}
      endAngle={-270}
      data={filteredData}
      size={width}
      valueFormatter={(value: number) => `${value} ${t("companies")}`}
    />
  );
}
