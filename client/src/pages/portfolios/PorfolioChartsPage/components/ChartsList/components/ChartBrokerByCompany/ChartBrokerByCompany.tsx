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

export default function ChartBrokerByCompany({
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

  // const options = {
  //   responsive: true,
  //   plugins: {
  //     legend: {
  //       display: false,
  //       position: "bottom" as const,
  //     },
  //     title: {
  //       display: true,
  //       text: t("Brokers"),
  //     },
  //     tooltip: {
  //       callbacks: {
  //         label(context: any) {
  //           const amount = `${context.label}: ${context.raw} ${t("companies")}`;
  //           return amount;
  //         },
  //       },
  //     },
  //   },
  // };

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
        console.log(
          `Loading brokers data for ${filteredChartData.length} companies`,
        );

        const brokers: any[] = [];

        const res = groupByName(filteredChartData, "broker");

        Object.entries(res).forEach(([k, v]) => {
          brokers.push({
            name: k,
            value: (v as any[]).length,
            color: getColorShade(k),
          });
        });

        setData(brokers);
      }
    }
    loadInitialStats();
  }, [filteredChartData, t]);

  if (data) {
    return (
      <Stack>
        <Center>
          <Title order={5}>{t("Brokers")}</Title>
        </Center>
        <Center>
          <PieChart
            withLabelsLine
            labelsPosition="outside"
            labelsType="value"
            withLabels
            withTooltip
            data={data}
            valueFormatter={(value: number) => `${value} ${t("companies")}`}
          />
        </Center>
      </Stack>
    );
  }
  return null;
}
