import React, { ReactElement, useEffect } from "react";
import { Bar } from "react-chartjs-2";
import { useTranslation } from "react-i18next";
import LoadingSpin from "components/LoadingSpin/LoadingSpin";
import { mapColorsToLabels } from "utils/colors";

interface Props {
  stats: any;
  portfolioCurrency: string;
}

export default function DividendsChart({
  stats,
  portfolioCurrency,
}: Props): ReactElement {
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
        text: t("Dividends"),
      },
      tooltip: {
        callbacks: {
          label(context: any) {
            const percentage = `${context.dataset.label}: ${context.raw.toFixed(
              2,
            )} ${portfolioCurrency}`;
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
            label: t("Dividends"),
            data: [],
            borderColor: "rgb(255, 99, 132)",
            backgroundColor: "rgba(255, 99, 132, 0.5)",
          },
        ],
      };
      const newYears: any = [];
      const dividends: any = [];

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
          year.sharesCount > 0 &&
          year.year !== "all" &&
          year.year !== 9999
        ) {
          newYears.push(year.year);
          dividends.push(Number(year.dividends));
        }
      });
      tempData.labels = newYears;
      tempData.datasets[0].data = dividends;

      const { chartColors } = mapColorsToLabels(newYears);

      tempData.datasets[0].backgroundColor = chartColors;

      setData(tempData);
      setIsDataSet(true);
    }
  }, [stats, t]);

  if (!isDataSet || !data) {
    return <LoadingSpin />;
  }
  return <Bar options={options} data={data} />;
}
