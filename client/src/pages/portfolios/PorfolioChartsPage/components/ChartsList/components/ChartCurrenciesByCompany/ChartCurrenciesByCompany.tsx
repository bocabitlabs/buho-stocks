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

export default function ChartCurrenciesByCompany({ data }: ChartProps) {
  const { t } = useTranslation();

  const filteredData = useMemo(
    function createChartData() {
      const filteredCompanies = data.filter((item: IPortfolioYearStats) => {
        return item.sharesCount > 0;
      });
      const currencies: { name: string; value: number; color: string }[] = [];
      const groupedByCurrencyCode = groupByName(
        filteredCompanies,
        "currencyCode",
      );

      Object.entries(groupedByCurrencyCode).forEach(([year, statsArray]) => {
        currencies.push({
          name: year,
          value: statsArray.length,
          color: getColorShade(year),
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
