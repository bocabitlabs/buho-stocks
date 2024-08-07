import React, { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";
import { PieChart } from "@mantine/charts";
import { Center, Stack, Title } from "@mantine/core";
import { useElementSize } from "@mantine/hooks";
import { usePortfolioYearStats } from "hooks/use-stats/use-portfolio-stats";
import { getColorShade } from "utils/colors";
import { groupByName } from "utils/grouping";

interface ChartProps {
  selectedYear: string;
}

export default function ChartSuperSectorsByCompany({
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
  const { ref, width } = useElementSize();

  useEffect(() => {
    if (statsData) {
      const tempData: any = statsData.filter((item: any) => {
        return item.sharesCount > 0;
      });

      setFilteredChartData(tempData);
    }
  }, [statsData]);

  useEffect(() => {
    async function loadInitialStats() {
      if (filteredChartData) {
        const sectors: any = [];

        const res = groupByName(filteredChartData, "superSectorName");

        Object.entries(res).forEach(([k, v]) => {
          sectors.push({
            name: t(k),
            value: (v as any[]).length,
            color: getColorShade(k),
          });
        });
        // Sort the sectors by value
        sectors.sort((a, b) => b.value - a.value);

        setData(sectors);
      }
    }
    loadInitialStats();
  }, [filteredChartData, t]);
  if (data) {
    return (
      <Stack>
        <Center>
          <Title order={5}>{t("Super Sectors")}</Title>
        </Center>
        <Center ref={ref}>
          <PieChart
            withLabelsLine
            labelsPosition="outside"
            labelsType="value"
            withLabels
            data={data}
            withTooltip
            size={width}
            valueFormatter={(value: number) => `${value} ${t("companies")}`}
          />
        </Center>
      </Stack>
    );
  }
  return null;
}
