import React, { useEffect } from "react";
import { Pie } from "react-chartjs-2";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";
import { usePortfolioYearStats } from "hooks/use-stats/use-portfolio-stats";
import { mapColorsToLabels } from "utils/colors";
import { groupByName } from "utils/grouping";

export default function ChartBrokerByCompany() {
  const { t } = useTranslation();
  const [data, setData] = React.useState<any>(null);
  const [filteredChartData, setFilteredChartData] = React.useState<any>(null);
  const { id } = useParams();
  const { data: statsData } = usePortfolioYearStats(+id!, "all", "company");

  const options = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
        position: "bottom" as const,
      },
      title: {
        display: true,
        text: t("Brokers"),
      },
      tooltip: {
        callbacks: {
          label(context: any) {
            const amount = `${context.label}: ${context.raw} ${t("companies")}`;
            return amount;
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
        console.log(
          `Loading brokers data for ${filteredChartData.length} companies`,
        );
        const tempData = {
          labels: [],
          datasets: [
            {
              label: t("Brokers"),
              data: [],
              borderColor: "rgb(255, 99, 132)",
              backgroundColor: "rgba(255, 99, 132, 0.5)",
            },
          ],
        };
        const sectors: any = [];
        const sectorsCount: any = [];

        const res = groupByName(filteredChartData, "broker");

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
