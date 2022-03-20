import React, { useEffect } from "react";
import { Pie } from "react-chartjs-2";
import { useTranslation } from "react-i18next";
import fewColors, { hexToRgb } from "utils/colors";

const groupBy = (arr: any[], key: string) => {
  const initialValue = {};
  return arr.reduce((acc, cval) => {
    const myAttribute = cval[key];
    acc[myAttribute] = [...(acc[myAttribute] || []), cval];
    return acc;
  }, initialValue);
};
interface Props {
  statsData: any;
}
export default function ChartCurrenciesByCompany({ statsData }: Props) {
  const { t } = useTranslation();

  const [data, setData] = React.useState<any>(null);

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "bottom" as const,
      },
      title: {
        display: true,
        text: t("Currencies"),
      },
    },
  };

  useEffect(() => {
    async function loadInitialStats() {
      const tempData = {
        labels: [],
        datasets: [
          {
            label: t("Currencies"),
            data: [],
            borderColor: "rgb(255, 99, 132)",
            backgroundColor: "rgba(255, 99, 132, 0.5)",
          },
        ],
      };
      const sectors: any = [];
      const sectorsCount: any = [];
      const colors: any = [];
      const borders: any = [];

      const res = groupBy(statsData, "currencyCode");

      Object.entries(res).forEach(([k, v], index: number) => {
        sectors.push(k);
        sectorsCount.push((v as any[]).length);
        const color = fewColors[index];
        colors.push(hexToRgb(color, 0.5));
        borders.push(hexToRgb(color, 0.8));
      });

      tempData.labels = sectors;
      tempData.datasets[0].data = sectorsCount;
      tempData.datasets[0].backgroundColor = colors;
      tempData.datasets[0].borderColor = borders;

      setData(tempData);
    }
    loadInitialStats();
  }, [statsData, t]);

  if (!data) {
    return <div>Loading...</div>;
  }
  return <Pie options={options} data={data} />;
}
