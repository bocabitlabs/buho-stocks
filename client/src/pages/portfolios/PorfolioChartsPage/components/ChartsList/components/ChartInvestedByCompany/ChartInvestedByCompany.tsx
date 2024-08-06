import React, { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";
import { BarChart } from "@mantine/charts";
import { Center, Stack, Title } from "@mantine/core";
import i18next from "i18next";
import { usePortfolioYearStats } from "hooks/use-stats/use-portfolio-stats";

interface ChartProps {
  selectedYear: string;
  currency: string | undefined;
}

export default function ChartInvestedByCompany({
  selectedYear,
  currency,
}: ChartProps): React.ReactElement | null {
  const { id } = useParams();
  const { t } = useTranslation();
  const [data, setData] = React.useState<any>(null);

  const { resolvedLanguage } = i18next;

  const numberFormatter = new Intl.NumberFormat(resolvedLanguage, {
    style: "decimal",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  const [filteredChartData, setFilteredChartData] = React.useState<any>(null);

  // Hooks
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
        const companies: any = [];

        filteredChartData.forEach((stat: any) => {
          companies.push({
            company: stat.company.ticker,
            value: Number(stat.accumulatedInvestment),
          });
        });

        companies.sort((a, b) => b.value - a.value);

        setData(companies);
      }
    }

    loadInitialStats();
  }, [filteredChartData, t, selectedYear]);

  if (data) {
    return (
      <Stack>
        <Center>
          <Title order={5}>{t("Accumulated investment")}</Title>
        </Center>
        <Center />
        <BarChart
          h={400}
          data={data}
          dataKey="company"
          series={[{ name: "value", color: "red" }]}
          valueFormatter={(value: number) =>
            `${numberFormatter.format(value)} ${currency}`
          }
          xAxisProps={{
            angle: -45,
            interval: 0,
            textAnchor: "end",
            height: 50, // Increase height to avoid clipping the labels
            tick: {
              style: { fontSize: 10 },
              transform: "translate(-10, 0)", // Adjust label position
            },
          }}
        />
      </Stack>
    );
  }
  return null;
}
