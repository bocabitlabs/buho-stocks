import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { BarChart } from "@mantine/charts";
import { IPortfolioYearStats } from "types/portfolio-year-stats";

interface ChartProps {
  data: IPortfolioYearStats[];
  currency: string;
}

export default function ChartInvestedByCompany({ data, currency }: ChartProps) {
  const {
    i18n: { resolvedLanguage },
  } = useTranslation();

  const numberFormatter = new Intl.NumberFormat(resolvedLanguage, {
    style: "decimal",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  const filteredData = useMemo(
    function createChartData() {
      const filteredCompanies: any = data.filter((item: any) => {
        return item.sharesCount > 0;
      });

      const companies: {
        company: string;
        value: number;
      }[] = [];

      filteredCompanies.forEach((stat: any) => {
        companies.push({
          company: stat.company.ticker,
          value: Number(stat.accumulatedInvestment),
        });
      });

      companies.sort((a, b) => b.value - a.value);

      return companies;
    },
    [data],
  );

  return (
    <BarChart
      h={400}
      data={filteredData}
      dataKey="company"
      series={[{ name: "value", color: "red" }]}
      valueFormatter={(value: number) =>
        `${numberFormatter.format(value)} ${currency}`
      }
      xAxisProps={{
        angle: -45,
        interval: 0,
        textAnchor: "end",
        height: 50, // Increase height to avoid clipping the labels
        tickSize: 10,
        transform: "translate(-10, 0)",
      }}
    />
  );
}
