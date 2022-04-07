import React, { ReactElement, useEffect } from "react";
import { Bar } from "react-chartjs-2";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";
import LoadingSpin from "components/LoadingSpin/LoadingSpin";
import { usePortfolio } from "hooks/use-portfolios/use-portfolios";
import { usePortfolioAllYearStats } from "hooks/use-stats/use-portfolio-stats";
import { mapColorsToLabels } from "utils/colors";

export default function ChartPortfolioDividends(): ReactElement {
  const { t } = useTranslation();
  const { id } = useParams();
  const [chartData, setChartData] = React.useState<any>(null);
  const { data, isFetching: loading } = usePortfolioAllYearStats(+id!);
  const { data: portfolio } = usePortfolio(+id!);

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top" as const,
      },
      title: {
        display: true,
        text: t("Portfolio Dividends"),
      },
      tooltip: {
        callbacks: {
          label(context: any) {
            const percentage = `${context.dataset.label}: ${context.raw.toFixed(
              2,
            )} ${portfolio?.baseCurrency.code}`;
            return percentage;
          },
        },
      },
    },
  };

  useEffect(() => {
    function getChartData() {
      return {
        labels: [],
        datasets: [
          {
            label: t("Dividends"),
            data: [],
            borderColor: "rgb(255, 99, 132)",
            backgroundColor: "rgba(255, 99, 132, 0.5)",
          },
        ],
      };
    }
    if (data) {
      const tempChartData = getChartData();

      const newYears: any = [];
      const dividends: any = [];

      data.sort((a: any, b: any) => {
        if (a.year > b.year) {
          return 1;
        }
        if (a.year < b.year) {
          return -1;
        }
        return 0;
      });
      data.forEach((year: any) => {
        if (
          !newYears.includes(year.year) &&
          year.year !== "all" &&
          year.year !== 9999
        ) {
          newYears.push(year.year);
          dividends.push(Number(year.dividends));
        }
      });
      tempChartData.labels = newYears;
      const { chartColors } = mapColorsToLabels(newYears);

      tempChartData.datasets[0].data = dividends;
      tempChartData.datasets[0].backgroundColor = chartColors;

      setChartData(tempChartData);
    }
  }, [data, t]);

  if (!chartData || loading) {
    return <LoadingSpin />;
  }
  return <Bar options={options} data={chartData} />;
}
