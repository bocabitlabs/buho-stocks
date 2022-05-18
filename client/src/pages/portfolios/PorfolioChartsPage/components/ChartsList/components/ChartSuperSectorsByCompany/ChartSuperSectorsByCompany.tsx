import React, { useEffect } from "react";
import { Pie } from "react-chartjs-2";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";
import { usePortfolioYearStats } from "hooks/use-stats/use-portfolio-stats";
import { mapColorsToLabels } from "utils/colors";
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

  const options = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
        position: "bottom" as const,
      },
      title: {
        display: true,
        text: t("Super sectors"),
      },
      tooltip: {
        callbacks: {
          label(context: any) {
            const count = `${context.label}: ${context.raw} ${t("companies")}`;
            return count;
          },
        },
      },
    },
  };

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
        const tempData = {
          labels: [],
          datasets: [
            {
              label: t("Super sectors"),
              data: [],
              borderColor: "rgb(255, 99, 132)",
              backgroundColor: "rgba(255, 99, 132, 0.5)",
            },
          ],
        };
        const sectors: any = [];
        const sectorsCount: any = [];

        const res = groupByName(filteredChartData, "superSectorName");

        Object.entries(res).forEach(([k, v]) => {
          sectors.push(k);
          sectorsCount.push((v as any[]).length);
        });

        tempData.labels = sectors;
        const { chartColors, chartBorders } = mapColorsToLabels(sectors);

        tempData.datasets[0].data = sectorsCount;
        tempData.datasets[0].backgroundColor = chartColors;
        tempData.datasets[0].borderColor = chartBorders;

        setData(tempData);
      }
    }
    loadInitialStats();
  }, [filteredChartData, t]);

  if (data) {
    return <Pie options={options} data={data} />;
  }
  return null;
}
