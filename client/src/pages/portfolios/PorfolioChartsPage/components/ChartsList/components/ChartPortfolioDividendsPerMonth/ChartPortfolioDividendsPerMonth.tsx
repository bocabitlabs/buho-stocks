import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";
import { BarChart } from "@mantine/charts";
import { Center, Stack, Title } from "@mantine/core";
import i18next from "i18next";
import { usePortfolio } from "hooks/use-portfolios/use-portfolios";
import { usePortfolioYearStats } from "hooks/use-stats/use-portfolio-stats";
import { getColorShade } from "utils/colors";

function MonthLabel({ payload, x, y }: any) {
  const { t } = useTranslation();
  return (
    <g transform={`translate(${x},${y})`}>
      <text
        x={0}
        y={0}
        dy={16}
        textAnchor="middle"
        fill="#666"
        fontSize={12} // Customize the font size
      >
        {t<string>(payload.value)}
      </text>
    </g>
  );
}

export default function ChartPortfolioDividendsPerMonth() {
  const { t } = useTranslation();
  const { id } = useParams();
  const { data: portfolio } = usePortfolio(+id!);

  const [chartData, setChartData] = useState<any>(null);
  const { data } = usePortfolioYearStats(+id!, "all", "month");

  const { resolvedLanguage } = i18next;

  const numberFormatter = new Intl.NumberFormat(resolvedLanguage, {
    style: "decimal",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  useEffect(() => {
    function getChartMonths() {
      return [
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
      ];
    }
    if (data) {
      const filteredChartData: any = [];
      const months = getChartMonths();

      // Create an object with the format above for each month
      months.forEach((month) => {
        filteredChartData.push({ month });
        Object.entries(data).forEach(([k, v]) => {
          const monthIndex = months.indexOf(month);
          filteredChartData[monthIndex][k] = v[month as keyof typeof v];
        });
      });

      // Generate the series for years
      const series = Object.keys(data).map((year) => ({
        name: year,
        color: getColorShade(year),
      }));

      const tempChartData = {
        series,
        data: filteredChartData,
      };

      setChartData(tempChartData);
    }
  }, [data, t]);

  if (chartData) {
    return (
      <Stack>
        <Center>
          <Title order={5}>{t("Portfolio Dividends per month")}</Title>
        </Center>
        <Center />
        <BarChart
          h={400}
          data={chartData.data}
          dataKey="month"
          series={chartData.series}
          tooltipProps={{
            itemSorter: (item: any) => {
              console.log("Item", item);
              return item.name;
            },
          }}
          valueFormatter={(value: number) =>
            `${numberFormatter.format(value)} ${portfolio.baseCurrency.code}`
          }
          xAxisProps={{
            angle: -45,
            tick: <MonthLabel />,
            // label: {
            //   formatter: (value: string) => {
            //     // console.log("Value", value);
            //     return t(value);
            //   },
            // },
            // interval: 0,
            // textAnchor: "end",
            // height: 50, // Increase height to avoid clipping the labels
            // tick: {
            //   style: { fontSize: 10 },
            //   transform: "translate(-10, 0)", // Adjust label position
            // },
          }}
        />
      </Stack>
    );
  }
  return null;
}
