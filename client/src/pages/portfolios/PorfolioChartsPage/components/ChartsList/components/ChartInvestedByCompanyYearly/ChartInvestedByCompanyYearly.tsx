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

export default function ChartInvestedByCompanyYearly({
  selectedYear,
  currency,
}: ChartProps): React.ReactElement | null {
  const { id } = useParams();
  const { t } = useTranslation();
  const [data, setData] = React.useState<any>(null);

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

  const options = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: true,
        text: t("Invested by company yearly"),
      },
      tooltip: {
        callbacks: {
          label(context: any) {
            const percentage = `${selectedYear}: ${context.raw.toFixed(
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
    function loadInitialStats() {
      if (filteredChartData) {
        const tempData = {
          labels: [],
          datasets: [
            {
              label: t("Invested yearly"),
              data: [],
              borderColor: "rgb(53, 162, 235)",
              backgroundColor: "rgba(53, 162, 235, 0.5)",
            },
          ],
        };
        const companies: any = [];
        const invested: any = [];

        filteredChartData.sort((a: any, b: any) => {
          if (Number(a.invested) < Number(b.invested)) {
            return 1;
          }
          if (Number(a.invested) > Number(b.invested)) {
            return -1;
          }
          return 0;
        });
        filteredChartData.forEach((stat: any) => {
          companies.push(stat.company.name);
          invested.push(Number(stat.invested));
        });
        tempData.labels = companies;
        const { chartColors } = mapColorsToLabels(companies);

        tempData.datasets[0].data = invested;
        tempData.datasets[0].backgroundColor = chartColors;

        setData(tempData);
      }
    }

    loadInitialStats();
  }, [filteredChartData, t, selectedYear]);

  if (data) {
    return <Bar options={options} data={data} />;
  }
  return null;
}
