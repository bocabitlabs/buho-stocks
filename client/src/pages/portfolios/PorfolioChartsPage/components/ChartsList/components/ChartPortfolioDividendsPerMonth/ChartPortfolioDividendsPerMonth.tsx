import React, { ReactElement, useEffect } from "react";
import { Bar } from "react-chartjs-2";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";
import { usePortfolio } from "hooks/use-portfolios/use-portfolios";
import { usePortfolioYearStats } from "hooks/use-stats/use-portfolio-stats";
import { manyColors, hexToRgb } from "utils/colors";

export default function ChartPortfolioDividendsPerMonth(): ReactElement | null {
  const { t } = useTranslation();
  const { id } = useParams();
  const { data: portfolio } = usePortfolio(+id!);

  const [chartData, setChartData] = React.useState<any>(null);
  const { data } = usePortfolioYearStats(+id!, "all", "month");

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
        labels: [
          t("January"),
          t("February"),
          t("March"),
          t("April"),
          t("May"),
          t("June"),
          t("July"),
          t("August"),
          t("September"),
          t("October"),
          t("November"),
          t("December"),
        ],
        datasets: [],
      };
    }
    if (data) {
      const tempChartData = getChartData();
      const dataSets: any = [];

      Object.entries(data).forEach(([k, v], index: number) => {
        const colorsArray: any[] = Array(12).fill(hexToRgb(manyColors[index]));

        const monthlyValues: any[] = Array(12).fill(0);

        Object.entries(v as object).forEach(([k1, v1]) => {
          const monthIndex = tempChartData.labels.indexOf(k1);
          monthlyValues[monthIndex] = v1;
        });

        const newDataset = {
          label: k,
          data: monthlyValues,
          backgroundColor: colorsArray,
        };
        dataSets.push(newDataset);
      });
      const sortedArrayOfObj = dataSets.sort((a: any, b: any) => {
        return b.label > a.label;
      });
      tempChartData.datasets = sortedArrayOfObj;
      setChartData(tempChartData);
    }
  }, [data, t]);

  if (chartData) {
    return <Bar options={options} data={chartData} />;
  }
  return null;
}
