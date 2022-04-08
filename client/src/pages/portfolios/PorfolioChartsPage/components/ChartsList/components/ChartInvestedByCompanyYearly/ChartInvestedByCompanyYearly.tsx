import React, { useEffect } from "react";
import { Bar } from "react-chartjs-2";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";
import { Alert, Form, Select, Space } from "antd";
import { usePortfolio } from "hooks/use-portfolios/use-portfolios";
import { usePortfolioYearStats } from "hooks/use-stats/use-portfolio-stats";
import { mapColorsToLabels } from "utils/colors";

export default function ChartInvestedByCompanyYearly() {
  const { id } = useParams();
  const { t } = useTranslation();
  const [data, setData] = React.useState<any>(null);
  const [years, setYears] = React.useState<any[]>([]);
  const [selectedYear, setSelectedYear] = React.useState<any | null>("all");
  const { data: portfolio } = usePortfolio(+id!);
  const [filteredChartData, setFilteredChartData] = React.useState<any>(null);
  // Hooks
  const { data: statsData } = usePortfolioYearStats(
    +id!,
    selectedYear,
    "company",
  );

  useEffect(() => {
    if (statsData) {
      const tempData: any = statsData.filter((item: any) => {
        return item.sharesCount > 0;
      });
      setFilteredChartData(tempData);
    }
  }, [statsData]);

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top" as const,
      },
      title: {
        display: true,
        text: t("Invested by company yearly"),
      },
      tooltip: {
        callbacks: {
          label(context: any) {
            const percentage = `${selectedYear}: ${context.raw.toFixed(2)} ${
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

  useEffect(() => {
    function loadInitialStats() {
      if (filteredChartData) {
        const tempData = {
          labels: [],
          datasets: [
            {
              label: t("Invested yearly"),
              data: [],
              borderColor: "rgb(53, 162, 235)",
              backgroundColor: "rgba(53, 162, 235, 0.5)",
            },
          ],
        };
        const companies: any = [];
        const invested: any = [];

        filteredChartData.sort((a: any, b: any) => {
          if (Number(a.invested) < Number(b.invested)) {
            return 1;
          }
          if (Number(a.invested) > Number(b.invested)) {
            return -1;
          }
          return 0;
        });
        filteredChartData.forEach((stat: any) => {
          companies.push(stat.company.name);
          invested.push(Number(stat.invested));
        });
        tempData.labels = companies;
        const { chartColors } = mapColorsToLabels(companies);

        tempData.datasets[0].data = invested;
        tempData.datasets[0].backgroundColor = chartColors;

        setData(tempData);
      }
    }

    loadInitialStats();
  }, [filteredChartData, t, selectedYear]);

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
        {selectedYear === "all" ? (
          <Alert
            message={t("Select a year")}
            description={t(
              "Select a year to visualize yearly investments by company",
            )}
            type="info"
            showIcon
          />
        ) : (
          <Bar options={options} data={data} />
        )}
        {}
      </Space>
    );
  }
  return null;
}
