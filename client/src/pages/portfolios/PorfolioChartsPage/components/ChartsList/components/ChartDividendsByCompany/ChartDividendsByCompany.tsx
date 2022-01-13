import React, { useEffect } from "react";
import { Pie } from "react-chartjs-2";
import { allColors, hexToRgb } from "utils/colors";

interface Props {
  statsData: any;
}
export default function ChartDividendsByCompany({ statsData }: Props) {
  const [data, setData] = React.useState<any>(null);

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "bottom" as const,
      },
      title: {
        display: true,
        text: "Dividends by company",
      },
      tooltip: {
        callbacks: {
          label(context: any) {
            let sum = 0;
            const label = context.label || "";
            const dataArr = context.chart.data.datasets[0].data;
            dataArr.map((data1: number) => {
              sum += Number(data1);
              return null;
            });
            const percentage = `${label}: ${(
              (Number(context.formattedValue) * 100) /
              sum
            ).toFixed(2)}%`;
            return percentage;
          },
        },
      },
    },
  };

  useEffect(() => {
    async function loadInitialStats() {
      console.log(
        `ChartDividendsByCompany: Loading stats data for ${statsData.length} companies`,
      );
      const tempData = {
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
      const companies: any = [];
      const accumulatedDividends: any = [];
      const colors: any = [];
      const borders: any = [];

      statsData.sort((a: any, b: any) => {
        if (Number(a.accumulatedDividends) < Number(b.accumulatedDividends)) {
          return 1;
        }
        if (Number(a.accumulatedDividends) > Number(b.accumulatedDividends)) {
          return -1;
        }
        return 0;
      });
      statsData.forEach((stat: any, index: number) => {
        companies.push(stat.company.name);
        accumulatedDividends.push(Number(stat.accumulatedDividends));
        const color = allColors[index];
        colors.push(hexToRgb(color, 0.5));
        borders.push(hexToRgb(color, 0.8));
      });
      tempData.labels = companies;
      tempData.datasets[0].data = accumulatedDividends;
      tempData.datasets[0].backgroundColor = colors;
      tempData.datasets[0].borderColor = borders;

      setData(tempData);
    }
    loadInitialStats();
  }, [statsData]);

  if (!data) {
    return <div>Loading...</div>;
  }
  return <Pie options={options} data={data} />;
}
