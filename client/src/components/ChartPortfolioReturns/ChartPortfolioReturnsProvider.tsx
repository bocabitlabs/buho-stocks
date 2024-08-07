import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";
import { Loader, Stack, Text } from "@mantine/core";
import BenchmarkSelect from "./BenchmarkSelect";
import ChartPortfolioReturns from "./ChartPortfolioReturns";
import {
  useAllBenchmarks,
  useBenchmarkValues,
} from "hooks/use-benchmarks/use-benchmarks";
import { usePortfolioAllYearStats } from "hooks/use-stats/use-portfolio-stats";

export default function ChartPortfolioReturnsProvider() {
  const { t } = useTranslation();
  const { id } = useParams();
  const [selectedIndex, setSelectedIndex] = useState<number | undefined>(
    undefined,
  );
  const { data: benchmarks, isFetching } = useAllBenchmarks();

  const { data: portfolioData, isLoading: isPortfolioStatsLoading } =
    usePortfolioAllYearStats(+id!);
  const { data: indexData, isFetching: indexIsFetching } =
    useBenchmarkValues(selectedIndex);

  const onChangeCallback = (value: string) => {
    setSelectedIndex(+value);
  };

  if (isPortfolioStatsLoading || isFetching || indexIsFetching) {
    return <Loader />;
  }

  if (portfolioData) {
    return (
      <Stack>
        <ChartPortfolioReturns data={portfolioData} indexData={indexData} />
        {benchmarks && benchmarks.length > 0 && (
          <BenchmarkSelect
            benchmarks={benchmarks}
            onChangeCallback={onChangeCallback}
          />
        )}
      </Stack>
    );
  }
  return <Text>{t("Not enough portfolio data yet to generate charts.")}</Text>;
}
