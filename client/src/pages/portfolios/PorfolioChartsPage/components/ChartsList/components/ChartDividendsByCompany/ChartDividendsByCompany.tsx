import React, { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";
import { PieChart } from "@mantine/charts";
import { Center, Stack, Title } from "@mantine/core";
import { useElementSize } from "@mantine/hooks";
import { usePortfolioYearStats } from "hooks/use-stats/use-portfolio-stats";
import { getColorShade } from "utils/colors";

interface ChartProps {
  selectedYear: string;
  currency: string;
}

export default function ChartDividendsByCompany({
  selectedYear,
  currency,
}: ChartProps) {
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
    function loadInitialStats() {
      if (filteredChartData) {
        const companies: any = [];

        filteredChartData.forEach((stat: any) => {
          companies.push({
            name: stat.company.ticker.replace(".", ""),
            label: stat.company.ticker,
            value: Number(stat.accumulatedDividends),
            color: getColorShade(stat.company.ticker),
          });
        });
        // Sort the sectors by value
        companies.sort((a, b) => b.value - a.value);

        console.log("companies", companies);
        setData(companies);
      }
    }
    loadInitialStats();
  }, [filteredChartData, t]);

  if (data) {
    return (
      <Stack>
        <Center>
          <Title order={5}>{t("Dividends by company")}</Title>
        </Center>
        <Center ref={ref}>
          <PieChart
            withLabelsLine
            labelsPosition="inside"
            labelsType="percent"
            valueFormatter={(value: number) => `${value} ${currency}`}
            tooltipProps={{
              label: (item: any) => {
                console.log(item);
                return item.label;
              },
            }}
            withLabels
            data={data}
            withTooltip
            tooltipDataSource="segment"
            size={width}
          />
        </Center>
      </Stack>
    );
  }
  return null;
}
