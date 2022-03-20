import React, { ReactElement } from "react";
import { Bar } from "react-chartjs-2";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";
import { usePortfolioYearStats } from "hooks/use-stats/use-portfolio-stats";
import { allColors, hexToRgb } from "utils/colors";

export default function ChartPortfolioDividendsPerMonth(): ReactElement {
  const { t } = useTranslation();
  const { id } = useParams();
  const [chartData, setChartData] = React.useState<any>(null);

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
    },
  };

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

  const { isFetching: loading } = usePortfolioYearStats(+id!, "all", "month", {
    onSuccess: (responseData: any) => {
      const tempChartData = getChartData();
      const dataSets: any = [];

      Object.entries(responseData).forEach(([k, v], index: number) => {
        const colorsArray: any[] = Array(12).fill(0);
        const monthlyValues: any[] = Array(12).fill(0);
        Object.entries(v as object).forEach(([k1, v1]) => {
          const monthIndex = tempChartData.labels.indexOf(k1);
          monthlyValues[monthIndex] = v1;
          colorsArray[monthIndex] = hexToRgb(allColors[index]);
        });
        const newDataset = {
          label: k,
          data: monthlyValues,
          // borderColor: hexToRgb(color, 0.8),
          backgroundColor: colorsArray,
        };
        dataSets.push(newDataset);
      });
      const sortedArrayOfObj = dataSets.sort((a: any, b: any) => {
        return b.label > a.label;
      });
      tempChartData.datasets = sortedArrayOfObj;
      setChartData(tempChartData);
    },
  });

  if (!chartData || loading) {
    return <div>{t("Loading...")}</div>;
  }
  return <Bar options={options} data={chartData} />;
}
