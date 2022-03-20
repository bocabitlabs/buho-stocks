import React, { useEffect } from "react";
import { Bar } from "react-chartjs-2";
import { useTranslation } from "react-i18next";

interface Props {
  statsData: any;
}
export default function ChartValueByCompany({ statsData }: Props) {
  const { t } = useTranslation();
  const [data, setData] = React.useState<any>(null);

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top" as const,
      },
      title: {
        display: true,
        text: t("Portfolio value by company"),
      },
    },
    scales: {
      x: {
        ticks: {
          autoSkip: false,
          maxRotation: 90,
          minRotation: 0,
        },
      },
    },
  };

  useEffect(() => {
    async function loadInitialStats() {
      const tempData = {
        labels: [],
        datasets: [
          {
            label: t("Portfolio value"),
            data: [],
            borderColor: "rgb(53, 162, 235)",
            backgroundColor: "rgba(53, 162, 235, 0.5)",
          },
        ],
      };
      const companies: any = [];
      const portfolioValue: any = [];

      statsData.sort((a: any, b: any) => {
        if (Number(a.portfolioValue) < Number(b.portfolioValue)) {
          return 1;
        }
        if (Number(a.portfolioValue) > Number(b.portfolioValue)) {
          return -1;
        }
        return 0;
      });
      statsData.forEach((stat: any) => {
        companies.push(stat.company.name);
        portfolioValue.push(Number(stat.portfolioValue));
      });
      tempData.labels = companies;
      tempData.datasets[0].data = portfolioValue;

      setData(tempData);
    }
    loadInitialStats();
  }, [statsData, t]);

  if (!data) {
    return <div>{t("Loading...")}</div>;
  }
  return <Bar options={options} data={data} />;
}
