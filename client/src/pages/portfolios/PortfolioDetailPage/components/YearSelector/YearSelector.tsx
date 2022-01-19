import React, { ReactElement, useEffect, useState } from "react";
import { Form, Select } from "antd";
import PortfolioCharts from "../PortfolioCharts/PortfolioCharts";
import StatsContent from "../StatsContent/StatsContent";
import StatsRefreshModal from "../StatsRefreshModal/StatsRefreshModal";
import { usePortfolioYearStats } from "hooks/use-stats/use-portfolio-stats";

interface Props {
  id: string | undefined;
  firstYear: number | null;
}

export default function YearSelector({ id, firstYear }: Props): ReactElement {
  const [selectedYear, setSelectedYear] = useState<any | null>("all");
  const [years, setYears] = useState<any[]>([]);
  const { data: stats, isFetching: loadingStats } = usePortfolioYearStats(
    +id!,
    selectedYear,
    undefined,
  );

  const handleYearChange = (value: string) => {
    setSelectedYear(value);
  };

  useEffect(() => {
    async function loadDropdownYears() {
      const currentYear = new Date().getFullYear();
      const newYears = [];
      if (firstYear != null) {
        for (let index = +currentYear; index >= +firstYear; index -= 1) {
          newYears.push(index);
        }
        setYears(newYears);
      }
    }

    loadDropdownYears();
  }, [firstYear]);

  return (
    <div style={{ marginTop: 16 }}>
      <Form layout="inline">
        <Select
          defaultValue={selectedYear}
          style={{ width: 120 }}
          onChange={handleYearChange}
          disabled={loadingStats}
          loading={loadingStats}
        >
          <Select.Option value="all">All</Select.Option>
          {years.map((yearItem: any) => (
            <Select.Option key={yearItem} value={yearItem}>
              {yearItem}
            </Select.Option>
          ))}
        </Select>
        <StatsRefreshModal id={id} selectedYear={selectedYear} />
      </Form>
      <div style={{ marginTop: 16 }}>
        <StatsContent stats={stats} />
      </div>
      <PortfolioCharts />
    </div>
  );
}
