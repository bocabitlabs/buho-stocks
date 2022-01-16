import React, { ReactElement, useEffect, useState } from "react";
import { Form, Select } from "antd";
import useFetch from "use-http";
import StatsContent from "../StatsContent/StatsContent";
import StatsRefreshModal from "../StatsRefreshModal/StatsRefreshModal";

interface Props {
  companyId: string | undefined;
  firstYear: number | null;
}

export default function YearSelector({
  companyId,
  firstYear,
}: Props): ReactElement {
  const [selectedYear, setSelectedYear] = useState<any | null>("all");
  const [years, setYears] = useState<number[]>([]);
  const [stats, setStats] = useState<any | null>(null);
  const [stockPrice, setStockPrice] = useState<any | null>(null);

  const {
    response,
    get,
    loading: loadingStats,
  } = useFetch(`stats/${companyId}`);

  const handleYearChange = (value: string) => {
    setSelectedYear(value);
  };

  useEffect(() => {
    async function loadInitialStats() {
      const initialData = await get(`/${selectedYear}/`);
      if (response.ok) {
        setStats(initialData);
        setStockPrice({
          price: initialData.stockPriceValue,
          priceCurrency: initialData.stockPriceCurrency,
          transactionDate: initialData.stockPriceTransactionDate,
        });
      }
    }
    loadInitialStats();
  }, [response.ok, get, companyId, selectedYear]);

  useEffect(() => {
    async function loadInitialStats() {
      const currentYear = new Date().getFullYear();
      const newYears: number[] = [];
      if (firstYear != null) {
        for (let index = +currentYear; index >= +firstYear; index -= 1) {
          newYears.push(index);
        }
        setYears(newYears);
      }
    }
    loadInitialStats();
  }, [firstYear]);

  return (
    <div>
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
            companyId={companyId}
            selectedYear={selectedYear}
            setStats={setStats}
            setStockPrice={setStockPrice}
          />
        </Form>
      </div>
      <div style={{ marginTop: 16 }}>
        <StatsContent stats={stats} stockPrice={stockPrice} />
      </div>
    </div>
  );
}
