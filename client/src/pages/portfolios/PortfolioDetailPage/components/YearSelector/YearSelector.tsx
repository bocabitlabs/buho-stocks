import React, { ReactElement, useEffect, useState } from "react";
import { Form, Select } from "antd";
import useFetch from "use-http";
import PortfolioCharts from "../PortfolioCharts/PortfolioCharts";
import StatsContent from "../StatsContent/StatsContent";
import StatsRefreshModal from "../StatsRefreshModal/StatsRefreshModal";

interface Props {
  id: string | undefined;
}

export default function YearSelector({ id }: Props): ReactElement {
  const [selectedYear, setSelectedYear] = useState<any | null>("all");
  const [years, setYears] = useState<any[]>([]);
  const [firstYear, setFirstYear] = useState<any | null>(null);
  const [stats, setStats] = useState<any | null>(null);
  const {
    response,
    get,
    loading: loadingStats,
  } = useFetch(`stats/portfolio/${id}`);
  const { response: yearResponse, get: getFirstYear } = useFetch(
    `stats/portfolio-first-year/${id}`,
  );
  const handleYearChange = (value: string) => {
    setSelectedYear(value);
  };

  useEffect(() => {
    async function loadFirstYear() {
      const initialData = await getFirstYear("/");
      if (yearResponse.ok) {
        setFirstYear(initialData.year);
        const currentYear = new Date().getFullYear();
        const newYears = [];
        if (firstYear != null) {
          for (let index = +currentYear; index >= +firstYear; index -= 1) {
            newYears.push(index);
          }
          setYears(newYears);
        }
      }
    }
    async function loadInitialStats() {
      const initialData = await get(`/${selectedYear}/`);
      if (response.ok) {
        setStats(initialData);
      }
    }
    loadInitialStats();
    loadFirstYear();
  }, [
    response.ok,
    get,
    selectedYear,
    getFirstYear,
    yearResponse.ok,
    firstYear,
  ]);

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
        <StatsRefreshModal
          id={id}
          selectedYear={selectedYear}
          setStats={setStats}
        />
      </Form>
      <div style={{ marginTop: 16 }}>
        <StatsContent stats={stats} />
      </div>
      <PortfolioCharts />
    </div>
  );
}
