import React, { useEffect } from "react";
import { Bar } from "react-chartjs-2";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";
import { usePortfolio } from "hooks/use-portfolios/use-portfolios";
import { mapColorsToLabels } from "utils/colors";

interface Props {
  statsData: any;
}
export default function ChartValueByCompany({ statsData }: Props) {
  const { id } = useParams();
  const { t } = useTranslation();
  const [data, setData] = React.useState<any>(null);
  const { data: portfolio } = usePortfolio(+id!);

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
      const { chartColors } = mapColorsToLabels(companies);

      tempData.datasets[0].data = portfolioValue;
      tempData.datasets[0].backgroundColor = chartColors;

      setData(tempData);
    }
    loadInitialStats();
  }, [statsData, t]);

  if (!data) {
    return <div>{t("Loading...")}</div>;
  }
  return <Bar options={options} data={data} />;
}
