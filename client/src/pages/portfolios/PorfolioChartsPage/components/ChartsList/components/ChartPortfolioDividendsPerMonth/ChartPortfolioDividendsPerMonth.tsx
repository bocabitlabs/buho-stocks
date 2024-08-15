import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { BarChart } from "@mantine/charts";
import i18next, { t } from "i18next";
import { IPortfolioYearStats } from "types/portfolio-year-stats";
import { getColorShade } from "utils/colors";

interface Props {
  data: IPortfolioYearStats[];
  currency: string;
}

interface MonthLabelProps {
  payload: {
    value: string;
  };
  x: number;
  y: number;
}

function MonthLabel({ payload, x, y }: MonthLabelProps) {
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

export default function ChartPortfolioDividendsPerMonth({
  data,
  currency,
}: Props) {
  const { resolvedLanguage } = i18next;

  const numberFormatter = new Intl.NumberFormat(resolvedLanguage, {
    style: "decimal",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  const filteredData = useMemo(
    function createChartData() {
      const months = [
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

      const results: {
        month: string;
        [key: string]: number | string;
      }[] = [];

      // Create an object with the format above for each month
      months.forEach((month) => {
        results.push({ month: t<string>(month) });
        Object.entries(data).forEach(([k, v]) => {
          const monthIndex = months.indexOf(month);
          results[monthIndex][k] = v[month as keyof typeof v] as number;
        });
      });

      // Generate the series for years
      const series = Object.keys(data).map((year) => ({
        name: year,
        color: getColorShade(year),
      }));

      const tempChartData = {
        series,
        data: results,
      };

      return tempChartData;
    },
    [data],
  );

  return (
    <BarChart
      h={400}
      data={filteredData.data}
      dataKey="month"
      series={filteredData.series}
      tooltipProps={{
        itemSorter: (item) => {
          return item.name;
        },
      }}
      valueFormatter={(value: number) =>
        `${numberFormatter.format(value)} ${currency}`
      }
      xAxisProps={{
        angle: -45,
        tick: (props) => <MonthLabel {...props} />,
      }}
    />
  );
}
