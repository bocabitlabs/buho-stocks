import React, { ReactElement, useEffect } from "react";
import { Line } from "react-chartjs-2";
import { useTranslation } from "react-i18next";

interface Props {
  stats: any;
}

export default function PortfolioReturnsChart({ stats }: Props): ReactElement {
  const { t } = useTranslation();
  const [data, setData] = React.useState<any>(null);
  const [isDataSet, setIsDataSet] = React.useState<boolean>(false);
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
  };
  useEffect(() => {
    if (stats) {
      const tempData = {
        labels: [],
        datasets: [
          {
            label: t("Return"),
            data: [],
            borderColor: "rgb(255, 99, 132)",
            backgroundColor: "rgba(255, 99, 132, 0.5)",
          },
          {
            label: t("Return + dividends"),
            data: [],
            borderColor: "rgb(53, 162, 235)",
            backgroundColor: "rgba(53, 162, 235, 0.5)",
          },
        ],
      };
      const newYears: any = [];
      const returnsPercent: any = [];
      const returnsWithDividendsPercent: any = [];
      stats.sort((a: any, b: any) => {
        if (a.year > b.year) {
          return 1;
        }
        if (a.year < b.year) {
          return -1;
        }
        return 0;
      });
      stats.forEach((year: any) => {
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
      tempData.labels = newYears;
      tempData.datasets[0].data = returnsPercent;
      tempData.datasets[1].data = returnsWithDividendsPercent;

      setData(tempData);
      setIsDataSet(true);
    }
  }, [stats, t]);

  if (!isDataSet || !data) {
    return <div>{t("Loading...")}</div>;
  }
  return <Line options={options} data={data} />;
}
