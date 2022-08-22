import React, { ReactElement, useEffect } from "react";
import { Line } from "react-chartjs-2";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";
import { Select } from "antd";
import {
  useBenchmarks,
  useBenchmarkValues,
} from "hooks/use-benchmarks/use-benchmarks";
import { usePortfolioAllYearStats } from "hooks/use-stats/use-portfolio-stats";
import { hexToRgb, manyColors } from "utils/colors";

export default function ChartPortfolioReturns(): ReactElement | null {
  const { t } = useTranslation();
  const { id } = useParams();
  const [chartData, setChartData] = React.useState<any>();
  const { data } = usePortfolioAllYearStats(+id!);

  const { data: benchmarks, isFetching } = useBenchmarks();

  const [selectedIndex, setSelectedIndex] = React.useState<number | undefined>(
    undefined,
  );
  const { data: indexData, isFetching: indexIsFetching } = useBenchmarkValues(
    selectedIndex !== undefined ? benchmarks[selectedIndex].id : undefined,
  );

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

  const onChange = (value: number) => {
    setSelectedIndex(value);
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
    if (data) {
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
            indexValue = indexData.find(
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

      if (indexData && selectedIndex !== undefined && benchmarks.length > 0) {
        tempChartData.datasets[2] = {
          label: benchmarks[selectedIndex].name,
          data: [],
          borderColor: hexToRgb(manyColors[17], 1),
          backgroundColor: hexToRgb(manyColors[17], 1),
          // yAxisID: "y",
        };
        tempChartData.datasets[2].data = indexPercents;
      }

      setChartData(tempChartData);
    }
  }, [data, indexData, benchmarks, selectedIndex, t]);

  if (chartData) {
    return (
      <div>
        {!indexIsFetching && <Line options={options} data={chartData} />}
        {benchmarks.length > 0 && (
          <Select
            showSearch
            placeholder="Select a index"
            onChange={onChange}
            loading={isFetching}
            style={{ marginTop: 20, minWidth: 200 }}
          >
            {benchmarks.map((element: any, index: number) => (
              <Select.Option key={element.id} value={index}>
                {element.name}
              </Select.Option>
            ))}
          </Select>
        )}
      </div>
    );
  }
  return null;
}
