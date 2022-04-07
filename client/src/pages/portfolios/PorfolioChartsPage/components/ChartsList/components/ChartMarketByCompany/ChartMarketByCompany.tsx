import React, { useEffect } from "react";
import { Pie } from "react-chartjs-2";
import { useTranslation } from "react-i18next";
import { mapColorsToLabels } from "utils/colors";
import { groupByName } from "utils/grouping";

interface Props {
  statsData: any;
}

export default function ChartMarketByCompany({ statsData }: Props) {
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
        text: t("Markets"),
      },
    },
  };

  useEffect(() => {
    function loadInitialStats() {
      const tempData = {
        labels: [],
        datasets: [
          {
            label: t("Markets"),
            data: [],
            borderColor: "rgb(255, 99, 132)",
            backgroundColor: "rgba(255, 99, 132, 0.5)",
          },
        ],
      };
      const sectors: any = [];
      const sectorsCount: any = [];

      const res = groupByName(statsData, "marketName");
      Object.entries(res).forEach(([k, v]) => {
        sectors.push(k);
        sectorsCount.push((v as any[]).length);
      });

      tempData.labels = sectors;
      const { chartColors, chartBorders } = mapColorsToLabels(sectors);

      tempData.datasets[0].data = sectorsCount;
      tempData.datasets[0].backgroundColor = chartColors;
      tempData.datasets[0].borderColor = chartBorders;

      setData(tempData);
    }
    loadInitialStats();
  }, [statsData, t]);

  if (!data) {
    return <div>{t("Loading...")}</div>;
  }
  return <Pie options={options} data={data} />;
}
