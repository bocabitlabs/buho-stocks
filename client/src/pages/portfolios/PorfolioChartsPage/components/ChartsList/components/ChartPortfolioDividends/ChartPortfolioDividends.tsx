import React, { ReactElement, useEffect } from "react";
import { Bar } from "react-chartjs-2";
import { useParams } from "react-router-dom";
import useFetch from "use-http";

export default function ChartPortfolioDividends(): ReactElement {
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
        labels: [],
        datasets: [
          {
            label: "Dividends",
            data: [],
            borderColor: "rgb(255, 99, 132)",
            backgroundColor: "rgba(255, 99, 132, 0.5)",
          },
        ],
      };
    }

    async function loadInitialStats() {
      const initialData = await get(`${id}/all-years`);
      if (response.ok) {
        if (initialData) {
          const chartData = getChartData();

          const newYears: any = [];
          const dividends: any = [];

          initialData.sort((a: any, b: any) => {
            if (a.year > b.year) {
              return 1;
            }
            if (a.year < b.year) {
              return -1;
            }
            return 0;
          });
          initialData.forEach((year: any) => {
            if (
              !newYears.includes(year.year) &&
              year.year !== "all" &&
              year.year !== 9999
            ) {
              newYears.push(year.year);
              dividends.push(Number(year.dividends));
            }
          });
          chartData.labels = newYears;
          chartData.datasets[0].data = dividends;

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
