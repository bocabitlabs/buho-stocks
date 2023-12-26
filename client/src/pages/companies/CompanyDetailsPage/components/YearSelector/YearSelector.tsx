import React, { ReactElement, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Form, Select } from "antd";
import StatsContent from "../StatsContent/StatsContent";
import StatsRefreshModal from "../StatsRefreshModal/StatsRefreshModal";
import { useCompanyYearStats } from "hooks/use-stats/use-company-stats";

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
  const [stockPrice, setStockPrice] = useState<any | null>(null);
  const { t } = useTranslation();
  const { data: stats, isFetching: loadingStats } = useCompanyYearStats(
    +companyId!,
    selectedYear,
  );

  const handleYearChange = (value: string) => {
    setSelectedYear(value);
  };

  useEffect(() => {
    if (stats) {
      setStockPrice({
        price: stats.stockPriceValue,
        priceCurrency: stats.stockPriceCurrency,
        transactionDate: stats.stockPriceTransactionDate,
      });
    }
  }, [stats]);

  useEffect(() => {
    async function loadInitialYears() {
      const currentYear = new Date().getFullYear();
      const newYears: number[] = [];
      if (firstYear != null) {
        for (let index = +currentYear; index >= +firstYear; index -= 1) {
          newYears.push(index);
        }
        setYears(newYears);
      }
    }
    loadInitialYears();
  }, [firstYear]);

  return (
    <div>
      <div style={{ marginTop: 16 }}>
        <Form layout="inline">
          <Form.Item name="year" label={t("Year")} initialValue={selectedYear}>
            <Select
              style={{ width: 120 }}
              onChange={handleYearChange}
              disabled={loadingStats}
              loading={loadingStats}
            >
              <Select.Option value="all">{t("All")}</Select.Option>
              {years.map((yearItem: any) => (
                <Select.Option key={yearItem} value={yearItem}>
                  {yearItem}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
          {selectedYear !== "all" && (
            <StatsRefreshModal
              companyId={companyId}
              selectedYear={selectedYear}
            />
          )}
        </Form>
      </div>
      <div style={{ marginTop: 16 }}>
        <StatsContent stats={stats} stockPrice={stockPrice} />
      </div>
    </div>
  );
}
