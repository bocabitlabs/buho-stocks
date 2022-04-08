import React, { useEffect } from "react";
import { Bar } from "react-chartjs-2";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";
import { Form, Select, Space } from "antd";
import { usePortfolio } from "hooks/use-portfolios/use-portfolios";
import { usePortfolioYearStats } from "hooks/use-stats/use-portfolio-stats";
import { mapColorsToLabels } from "utils/colors";

export default function ChartInvestedByCompany() {
  const { id } = useParams();
  const { t } = useTranslation();
  const [years, setYears] = React.useState<any[]>([]);
  const [data, setData] = React.useState<any>(null);
  const [selectedYear, setSelectedYear] = React.useState<any | null>("all");
  const [filteredChartData, setFilteredChartData] = React.useState<any>(null);
  const { data: portfolio } = usePortfolio(+id!);
  const { data: statsData } = usePortfolioYearStats(
    +id!,
    selectedYear,
    "company",
  );

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top" as const,
      },
      title: {
        display: true,
        text: t("Accumulated investment by company"),
      },
      tooltip: {
        callbacks: {
          label(context: any) {
            const percentage = `${context.label}: ${context.raw.toFixed(2)} ${
              portfolio?.baseCurrency.code
            }`;
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
              label: t("Accumulated investment"),
              data: [],
              borderColor: "rgb(53, 162, 235)",
              backgroundColor: "rgba(53, 162, 235, 0.5)",
            },
          ],
        };
        const companies: any = [];
        const accumulatedInvestment: any = [];

        filteredChartData.sort((a: any, b: any) => {
          if (
            Number(a.accumulatedInvestment) < Number(b.accumulatedInvestment)
          ) {
            return 1;
          }
          if (
            Number(a.accumulatedInvestment) > Number(b.accumulatedInvestment)
          ) {
            return -1;
          }
          return 0;
        });
        filteredChartData.forEach((stat: any) => {
          companies.push(stat.company.name);
          accumulatedInvestment.push(Number(stat.accumulatedInvestment));
        });
        tempData.labels = companies;
        const { chartColors } = mapColorsToLabels(companies);

        tempData.datasets[0].data = accumulatedInvestment;
        tempData.datasets[0].backgroundColor = chartColors;
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
        <Bar options={options} data={data} />
      </Space>
    );
  }
  return null;
}
