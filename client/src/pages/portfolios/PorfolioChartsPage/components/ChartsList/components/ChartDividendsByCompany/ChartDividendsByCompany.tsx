import React, { useEffect } from "react";
import { Pie } from "react-chartjs-2";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";
import { Form, Select, Space } from "antd";
import { usePortfolio } from "hooks/use-portfolios/use-portfolios";
import { usePortfolioYearStats } from "hooks/use-stats/use-portfolio-stats";
import { mapColorsToLabels } from "utils/colors";

export default function ChartDividendsByCompany() {
  const { t } = useTranslation();
  const [data, setData] = React.useState<any>(null);
  const [filteredChartData, setFilteredChartData] = React.useState<any>(null);
  const { id } = useParams();
  const [years, setYears] = React.useState<any[]>([]);
  const { data: portfolio } = usePortfolio(+id!);
  const [selectedYear, setSelectedYear] = React.useState<any | null>("all");
  const { data: statsData } = usePortfolioYearStats(
    +id!,
    selectedYear,
    "company",
  );

  const options = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
        position: "bottom" as const,
      },
      title: {
        display: true,
        text: t("Dividends by company"),
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
              (Number(context.parsed) * 100) /
              sum
            ).toFixed(2)}%`;
            return percentage;
          },
        },
      },
    },
  };

  const handleYearChange = (value: string) => {
    setSelectedYear(value);
  };

  useEffect(() => {
    if (statsData) {
      const tempData: any = statsData.filter((item: any) => {
        return item.sharesCount > 0;
      });

      setFilteredChartData(tempData);
    }
  }, [statsData]);

  useEffect(() => {
    function loadInitialStats() {
      if (filteredChartData) {
        const tempData = {
          labels: [],
          datasets: [
            {
              label: t("Dividends"),
              data: [],
              borderColor: "rgb(255, 99, 132)",
              backgroundColor: "rgba(255, 99, 132, 0.5)",
            },
          ],
        };
        const companies: any = [];
        const accumulatedDividends: any = [];

        filteredChartData.sort((a: any, b: any) => {
          if (Number(a.accumulatedDividends) < Number(b.accumulatedDividends)) {
            return 1;
          }
          if (Number(a.accumulatedDividends) > Number(b.accumulatedDividends)) {
            return -1;
          }
          return 0;
        });
        filteredChartData.forEach((stat: any) => {
          companies.push(stat.company.name);
          accumulatedDividends.push(Number(stat.accumulatedDividends));
        });
        tempData.labels = companies;
        tempData.datasets[0].data = accumulatedDividends;
        const { chartColors, chartBorders } = mapColorsToLabels(companies);

        tempData.datasets[0].backgroundColor = chartColors;
        tempData.datasets[0].borderColor = chartBorders;

        setData(tempData);
      }
    }
    loadInitialStats();
  }, [filteredChartData, t]);

  useEffect(() => {
    async function loadFirstYear() {
      const currentYear = new Date().getFullYear();
      const newYears = [];
      if (portfolio && portfolio.firstYear != null) {
        for (
          let index = +currentYear;
          index >= +portfolio.firstYear;
          index -= 1
        ) {
          newYears.push(index);
        }
        setYears(newYears);
      }
    }
    loadFirstYear();
  }, [portfolio]);

  if (data) {
    return (
      <Space direction="vertical" style={{ width: "100%" }}>
        <Form layout="inline">
          <Form.Item label={t("Year")}>
            <Select
              placeholder="Select a year"
              defaultValue={selectedYear}
              style={{ width: 120 }}
              onChange={handleYearChange}
            >
              <Select.Option value="all">All</Select.Option>
              {years.map((yearItem: any) => (
                <Select.Option key={yearItem} value={yearItem}>
                  {yearItem}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
        </Form>
        <Pie options={options} data={data} />
      </Space>
    );
  }
  return null;
}
