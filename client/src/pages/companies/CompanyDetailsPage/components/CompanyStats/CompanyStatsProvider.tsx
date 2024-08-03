import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Alert, Group, Loader, Paper, Stack } from "@mantine/core";
import StatsContent from "./components/StatsContent/StatsContent";
import StatsRefreshModal from "./components/StatsRefreshModal/StatsRefreshModal";
import YearSelector from "./components/YearSelector/YearSelector";
import { useCompanyYearStats } from "hooks/use-stats/use-company-stats";

interface Props {
  companyId: string;
  firstYear: number;
}

function loadInitialYears(firstYear: number) {
  const currentYear = new Date().getFullYear();
  const newYears: number[] = [];
  if (firstYear != null) {
    for (let index = +currentYear; index >= +firstYear; index -= 1) {
      newYears.push(index);
    }
    return newYears;
  }
  return [];
}

export default function YearSelectorProvider({ companyId, firstYear }: Props) {
  const { t } = useTranslation();
  const [selectedYear, setSelectedYear] = useState<any | null>("all");

  const { data, isLoading, isError, error } = useCompanyYearStats(
    +companyId!,
    selectedYear,
  );

  const years = loadInitialYears(firstYear);

  const onYearChange = (year: any) => {
    setSelectedYear(year);
  };

  if (isLoading) {
    return <Loader />;
  }
  if (isError) {
    return (
      <Alert variant="light" color="red" title={t("Unable to load company")}>
        {error.message}
      </Alert>
    );
  }

  if (firstYear && data) {
    return (
      <Paper p="lg" shadow="xs">
        <Stack>
          <Group>
            <YearSelector
              years={years}
              onYearChange={onYearChange}
              selectedYear={selectedYear}
            />
            {selectedYear !== "all" && (
              <StatsRefreshModal
                companyId={companyId}
                selectedYear={selectedYear}
              />
            )}
          </Group>
          <StatsContent
            stats={data}
            stockPrice={{
              price: data.stockPriceValue,
              priceCurrency: data.stockPriceCurrency,
              transactionDate: data.stockPriceTransactionDate,
            }}
          />
        </Stack>
      </Paper>
    );
  }
  return null;
}
