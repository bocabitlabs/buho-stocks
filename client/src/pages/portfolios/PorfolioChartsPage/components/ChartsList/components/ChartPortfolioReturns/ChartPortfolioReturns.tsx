import React, { ReactElement } from "react";
import { Line } from "react-chartjs-2";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";
import { usePortfolioAllYearStats } from "hooks/use-stats/use-portfolio-stats";

export default function ChartPortfolioReturns(): ReactElement {
  const { t } = useTranslation();
  const { id } = useParams();
  const [chartData, setChartData] = React.useState<any>();

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

  function getChartData() {
    return {
      labels: [],
      datasets: [
        {
          label: t("Return Percent"),
          data: [],
          borderColor: "rgb(255, 99, 132)",
          backgroundColor: "rgba(255, 99, 132, 0.5)",
          yAxisID: "y",
        },
        {
          label: t("Return + dividends"),
          data: [],
          borderColor: "rgb(53, 162, 235)",
          backgroundColor: "rgba(53, 162, 235, 0.5)",
          yAxisID: "y",
        },
      ],
    };
  }

  const { isFetching: loading } = usePortfolioAllYearStats(+id!, {
    onSuccess: (responseData: any) => {
      const tempChartData = getChartData();

      const newYears: any = [];
      const returnsPercent: any = [];
      const returnsWithDividendsPercent: any = [];

      responseData.sort((a: any, b: any) => {
        if (a.year > b.year) {
          return 1;
        }
        if (a.year < b.year) {
          return -1;
        }
        return 0;
      });
      responseData.forEach((year: any) => {
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
    },
  });

  if (!chartData || loading) {
    return <div>{t("Loading...")}</div>;
  }
  return <Line options={options} data={chartData} />;
}
