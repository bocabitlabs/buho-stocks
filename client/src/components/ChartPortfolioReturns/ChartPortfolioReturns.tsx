import React, { ReactElement, useEffect } from "react";
import { Line } from "react-chartjs-2";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";
import LoadingSpin from "components/LoadingSpin/LoadingSpin";
import { usePortfolioAllYearStats } from "hooks/use-stats/use-portfolio-stats";
import { hexToRgb, manyColors } from "utils/colors";

export default function ChartPortfolioReturns(): ReactElement {
  const { t } = useTranslation();
  const { id } = useParams();
  const [chartData, setChartData] = React.useState<any>();
  const { data, isFetching: loading } = usePortfolioAllYearStats(+id!);

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top" as const,
      },
      title: {
        display: true,
        text: t("Portfolio Returns"),
      },
      tooltip: {
        callbacks: {
          label(context: any) {
            const percentage = `${context.dataset.label}: ${context.raw.toFixed(
              2,
            )}%`;
            return percentage;
          },
        },
      },
    },
    scales: {
      y: {
        type: "linear" as const,
        display: true,
        position: "left" as const,
      },
      y1: {
        type: "linear" as const,
        display: true,
        position: "right" as const,
        grid: {
          drawOnChartArea: false,
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
            label: t("Return Percent"),
            data: [],
            borderColor: hexToRgb(manyColors[10], 1),
            backgroundColor: hexToRgb(manyColors[10], 1),
            yAxisID: "y",
          },
          {
            label: t("Return + dividends"),
            data: [],
            borderColor: hexToRgb(manyColors[16], 1),
            backgroundColor: hexToRgb(manyColors[16], 1),
            yAxisID: "y",
          },
        ],
      };
    }
    if (data) {
      const tempChartData = getChartData();

      const newYears: any = [];
      const returnsPercent: any = [];
      const returnsWithDividendsPercent: any = [];

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
          returnsPercent.push(Number(year.returnPercent));
          returnsWithDividendsPercent.push(
            Number(year.returnWithDividendsPercent),
          );
        }
      });
      tempChartData.labels = newYears;
      tempChartData.datasets[0].data = returnsPercent;
      tempChartData.datasets[1].data = returnsWithDividendsPercent;

      setChartData(tempChartData);
    }
  }, [data, t]);

  if (!chartData || loading) {
    return <LoadingSpin />;
  }
  return <Line options={options} data={chartData} />;
}
