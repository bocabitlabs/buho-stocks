import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Alert, Group, Loader, Paper, Stack } from "@mantine/core";
import StatsContent from "./components/StatsContent/StatsContent";
import StatsRefreshModal from "./components/StatsRefreshModal/StatsRefreshModal";
import { usePortfolioYearStats } from "hooks/use-stats/use-portfolio-stats";
import YearSelector from "pages/companies/CompanyDetailsPage/components/CompanyStats/components/YearSelector/YearSelector";

interface Props {
  portfolioId: string;
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

export default function PortfolioStatsProvider({
  portfolioId,
  firstYear,
}: Props) {
  const { t } = useTranslation();

  const years = loadInitialYears(firstYear);
  const [selectedYear, setSelectedYear] = useState<string | null>("all");

  const { data, isLoading, isError, error } = usePortfolioYearStats(
    +portfolioId!,
    selectedYear,
  );

  const onYearChange = (year: string | null) => {
    if (year === null) {
      return;
    }
    setSelectedYear(year);
  };

  if (isLoading) {
    return <Loader />;
  }
  if (isError) {
    return (
      <Alert
        variant="light"
        color="red"
        title={t("Unable to load portfolio stats")}
      >
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
              selectedYear={selectedYear}
              onYearChange={onYearChange}
            />
            {selectedYear && selectedYear !== "all" && (
              <StatsRefreshModal
                portfolioId={portfolioId}
                selectedYear={selectedYear}
              />
            )}
          </Group>
          <StatsContent stats={data} />
        </Stack>
      </Paper>
    );
  }

  return null;
}
