import React, { useEffect } from "react";
import { Bar } from "react-chartjs-2";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";
import { usePortfolioYearStats } from "hooks/use-stats/use-portfolio-stats";
import { mapColorsToLabels } from "utils/colors";

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

  const [filteredChartData, setFilteredChartData] = React.useState<any>(null);
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
      },
      title: {
        display: true,
        text: t("Accumulated investment by company"),
      },
      tooltip: {
        callbacks: {
          label(context: any) {
            const percentage = `${context.label}: ${context.raw.toFixed(
              2,
            )} ${currency}`;
            return percentage;
          },
        },
      },
    },
    scales: {
      x: {
        ticks: {
          autoSkip: false,
          maxRotation: 90,
          minRotation: 0,
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
    function loadInitialStats() {
      if (filteredChartData) {
        const tempData = {
          labels: [],
          datasets: [
            {
              label: t("Accumulated investment"),
              data: [],
              borderColor: "rgb(53, 162, 235)",
              backgroundColor: "rgba(53, 162, 235, 0.5)",
            },
          ],
        };
        const companies: any = [];
        const accumulatedInvestment: any = [];

        filteredChartData.sort((a: any, b: any) => {
          if (
            Number(a.accumulatedInvestment) < Number(b.accumulatedInvestment)
          ) {
            return 1;
          }
          if (
            Number(a.accumulatedInvestment) > Number(b.accumulatedInvestment)
          ) {
            return -1;
          }
          return 0;
        });
        filteredChartData.forEach((stat: any) => {
          companies.push(stat.company.name);
          accumulatedInvestment.push(Number(stat.accumulatedInvestment));
        });
        tempData.labels = companies;
        const { chartColors } = mapColorsToLabels(companies);

        tempData.datasets[0].data = accumulatedInvestment;
        tempData.datasets[0].backgroundColor = chartColors;
        setData(tempData);
      }
    }
    loadInitialStats();
  }, [filteredChartData, t]);

  if (data) {
    return <Bar options={options} data={data} />;
  }
  return null;
}
