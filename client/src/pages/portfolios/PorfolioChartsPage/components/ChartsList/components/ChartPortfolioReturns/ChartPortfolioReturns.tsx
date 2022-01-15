import React, { ReactElement, useEffect } from "react";
import { Line } from "react-chartjs-2";
import { useParams } from "react-router-dom";
import useFetch from "use-http";

export default function ChartPortfolioReturns(): ReactElement {
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
        text: "Portfolio Returns",
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
            label: "Return Percent",
            data: [],
            borderColor: "rgb(255, 99, 132)",
            backgroundColor: "rgba(255, 99, 132, 0.5)",
            yAxisID: "y",
          },
          {
            label: "Return w.d. Percent",
            data: [],
            borderColor: "rgb(53, 162, 235)",
            backgroundColor: "rgba(53, 162, 235, 0.5)",
            yAxisID: "y",
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
          const returnsPercent: any = [];
          const returnsWithDividendsPercent: any = [];

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
              returnsPercent.push(Number(year.returnPercent));
              returnsWithDividendsPercent.push(
                Number(year.returnWithDividendsPercent),
              );
            }
          });
          chartData.labels = newYears;
          chartData.datasets[0].data = returnsPercent;
          chartData.datasets[1].data = returnsWithDividendsPercent;

          setData(chartData);
          // setIsDataSet(true);
        }
      }
    }
    loadInitialStats();
  }, [response.ok, get, id]);

  if (!data || loading) {
    return <div>Loading...</div>;
  }
  return <Line options={options} data={data} />;
}
