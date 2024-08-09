import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { PieChart } from "@mantine/charts";
import { IPortfolioYearStats } from "types/portfolio-year-stats";
import { getColorShade } from "utils/colors";
import { groupByName } from "utils/grouping";

interface ChartProps {
  data: IPortfolioYearStats[];
}

export default function ChartCurrenciesByCompany({ data }: ChartProps) {
  const { t } = useTranslation();

  const filteredData = useMemo(
    function createChartData() {
      const filteredCompanies: any = data.filter((item: any) => {
        return item.sharesCount > 0;
      });
      const currencies: { name: string; value: number; color: string }[] = [];
      const res = groupByName(filteredCompanies, "currencyCode");

      Object.entries(res).forEach(([k, v]) => {
        currencies.push({
          name: k,
          value: (v as any[]).length,
          color: getColorShade(k),
        });
      });
      currencies.sort((a, b) => b.value - a.value);
      return currencies;
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
      valueFormatter={(value: number) => `${value} ${t("companies")}`}
    />
  );
}
