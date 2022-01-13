import React, { ReactElement, useEffect } from "react";
import { Bar } from "react-chartjs-2";
import { useParams } from "react-router-dom";
import useFetch from "use-http";
import { allColors, hexToRgb } from "utils/colors";

export default function ChartPortfolioDividendsPerMonth(): ReactElement {
  const { id } = useParams();
  const [data, setData] = React.useState<any>(null);
  const { get, response, loading } = useFetch(`stats/portfolio`);

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top" as const,
      },
      title: {
        display: true,
        text: "Portfolio Dividends",
      },
    },
  };

  useEffect(() => {
    function getChartData() {
      return {
        labels: [
          "January",
          "February",
          "March",
          "April",
          "May",
          "June",
          "July",
          "August",
          "September",
          "October",
          "November",
          "December",
        ],
        datasets: [],
      };
    }

    async function loadInitialStats() {
      const initialData = await get(`${id}/year/all/monthly/`);
      if (response.ok) {
        if (initialData) {
          const chartData = getChartData();
          const dataSets: any = [];

          Object.entries(initialData).forEach(([k, v], index: number) => {
            const colorsArray: any[] = Array(12).fill(0);
            const monthlyValues: any[] = Array(12).fill(0);
            Object.entries(v as object).forEach(([k1, v1]) => {
              const monthNumber = Number(k1);
              monthlyValues[monthNumber - 1] = v1;
              colorsArray[monthNumber - 1] = hexToRgb(allColors[index]);
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
          chartData.datasets = sortedArrayOfObj;
          setData(chartData);
        }
      }
    }
    loadInitialStats();
  }, [response.ok, get, id]);

  if (!data || loading) {
    return <div>Loading...</div>;
  }
  return <Bar options={options} data={data} />;
}
