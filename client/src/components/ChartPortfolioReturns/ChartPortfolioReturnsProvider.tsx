import { useState } from "react";
import { useParams } from "react-router-dom";
import { Loader, Stack } from "@mantine/core";
import BenchmarkSelect from "./BenchmarkSelect";
import ChartPortfolioReturns from "./ChartPortfolioReturns";
import {
  useAllBenchmarks,
  useBenchmarkValues,
} from "hooks/use-benchmarks/use-benchmarks";
import { usePortfolioAllYearStats } from "hooks/use-stats/use-portfolio-stats";

export default function ChartPortfolioReturnsProvider() {
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

  return (
    <Stack>
      {portfolioData && (
        <ChartPortfolioReturns data={portfolioData} indexData={indexData} />
      )}
      {benchmarks && benchmarks.length > 0 && (
        <BenchmarkSelect
          benchmarks={benchmarks}
          onChangeCallback={onChangeCallback}
        />
      )}
    </Stack>
  );
}
