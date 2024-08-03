import { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import { useTranslation } from "react-i18next";
import { IBenchmark } from "types/benchmark";
import { IPortfolioYearStats } from "types/portfolio-year-stats";
import { hexToRgb, manyColors } from "utils/colors";

interface Props {
  data: IPortfolioYearStats[];
  indexData: IBenchmark;
  // benchmarks: any;
  // selectedIndex: number;
}

export default function ChartPortfolioReturns({ data, indexData }: Props) {
  const { t } = useTranslation();
  const [chartData, setChartData] = useState<any>();

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
            // yAxisID: "y",
          },
          {
            label: t("Return + dividends"),
            data: [],
            borderColor: hexToRgb(manyColors[16], 1),
            backgroundColor: hexToRgb(manyColors[16], 1),
            // yAxisID: "y",
          },
        ],
      };
    }
    if (data && data.length > 0) {
      const tempChartData = getChartData();

      const newYears: any = [];
      const returnsPercent: any = [];
      const returnsWithDividendsPercent: any = [];
      const indexPercents: any = [];

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
          let indexValue = null;
          if (indexData) {
            indexValue = indexData.years.find(
              (indexItem: any) => indexItem.year === year.year,
            );
            indexPercents.push(
              indexValue ? Number(indexValue.returnPercentage) : 0,
            );
          }
        }
      });
      tempChartData.labels = newYears;
      tempChartData.datasets[0].data = returnsPercent;
      tempChartData.datasets[1].data = returnsWithDividendsPercent;

      if (indexData) {
        tempChartData.datasets[2] = {
          // label: benchmarks[selectedIndex].name,
          label: "Index",
          data: [],
          borderColor: hexToRgb(manyColors[17], 1),
          backgroundColor: hexToRgb(manyColors[17], 1),
          // yAxisID: "y",
        };
        tempChartData.datasets[2].data = indexPercents;
      }

      setChartData(tempChartData);
    }
  }, [data, indexData, t]);

  if (chartData) {
    return <Line options={options} data={chartData} />;
  }
  return null;
}
