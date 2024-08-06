import React, { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";
import { PieChart } from "@mantine/charts";
import { Center, Stack, Title } from "@mantine/core";
import { usePortfolioYearStats } from "hooks/use-stats/use-portfolio-stats";
import { getColorShade } from "utils/colors";
import { groupByName } from "utils/grouping";

interface ChartProps {
  selectedYear: string;
}

export default function ChartMarketByCompany({
  selectedYear,
}: ChartProps): React.ReactElement | null {
  const { t } = useTranslation();
  const [data, setData] = React.useState<any>(null);
  const [filteredChartData, setFilteredChartData] = React.useState<any>(null);
  const { id } = useParams();
  const { data: statsData } = usePortfolioYearStats(
    +id!,
    selectedYear,
    "company",
  );

  useEffect(() => {
    if (statsData) {
      const tempData: any = statsData.filter((item: any) => {
        return item.sharesCount > 0;
      });

      setFilteredChartData(tempData);
    }
  }, [statsData]);

  useEffect(() => {
    function loadInitialStats() {
      if (filteredChartData) {
        const markets: any = [];

        const res = groupByName(filteredChartData, "marketName");
        Object.entries(res).forEach(([k, v]) => {
          markets.push({
            name: k,
            value: (v as any[]).length,
            color: getColorShade(k),
          });
        });

        setData(markets);
      }
    }
    loadInitialStats();
  }, [filteredChartData, t]);

  if (data) {
    return (
      <Stack>
        <Center>
          <Title order={5}>{t("Markets")}</Title>
        </Center>
        <Center>
          <PieChart
            withLabelsLine
            labelsPosition="outside"
            labelsType="value"
            withLabels
            data={data}
            withTooltip
            valueFormatter={(value: number) => `${value} ${t("companies")}`}
          />
        </Center>
      </Stack>
    );
  }
  return null;
}
