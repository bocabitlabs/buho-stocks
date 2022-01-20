import { useMutation, useQuery } from "react-query";
import axios from "axios";
import { getAxiosOptionsWithAuth } from "api/api-client";
import queryClient from "api/query-client";
import { IPortfolioYearStats } from "types/portfolio-year-stats";

export const fetchYearStats = async (
  portfolioId: number | undefined,
  year: string | undefined,
  groupBy?: string | undefined,
) => {
  let grouping = "";
  if (groupBy) {
    grouping = `?groupBy=${groupBy}`;
  }
  const { data } = await axios.get<IPortfolioYearStats>(
    `/api/v1/stats/portfolio/${portfolioId}/year/${year}/${grouping}`,
    getAxiosOptionsWithAuth(),
  );
  return data;
};

export const fetchAllYearsStats = async (portfolioId: number | undefined) => {
  const { data } = await axios.get<IPortfolioYearStats[]>(
    `/api/v1/stats/portfolio/${portfolioId}/all-years/`,
    getAxiosOptionsWithAuth(),
  );
  return data;
};

export function usePortfolioYearStats(
  portfolioId: number | undefined,
  year: string | undefined,
  groupBy: string | undefined,
  otherOptions?: any,
) {
  return useQuery<IPortfolioYearStats, Error>(
    ["portfolioYearStats", portfolioId, year, groupBy],
    () => fetchYearStats(portfolioId, year, groupBy),
    {
      enabled: !!portfolioId && !!year,
      ...otherOptions,
    },
  );
}

export function usePortfolioAllYearStats(
  portfolioId: number | undefined,
  otherOptions?: any,
) {
  return useQuery<IPortfolioYearStats[], Error>(
    ["portfolioAllYearsStats", portfolioId],
    () => fetchAllYearsStats(portfolioId),
    {
      enabled: !!portfolioId,
      ...otherOptions,
    },
  );
}

interface IUpdateYearStatsMutationProps {
  portfolioId: number | undefined;
  year: string | undefined;
}

export const useUpdatePortfolioYearStatsForced = () => {
  return useMutation(
    ({ portfolioId, year }: IUpdateYearStatsMutationProps) =>
      axios.put(
        `/api/v1/stats/portfolio/${portfolioId}/year/${year}/`,
        {},
        getAxiosOptionsWithAuth(),
      ),
    {
      onSuccess: (data, variables) => {
        queryClient.invalidateQueries([
          "portfolioYearStats",
          variables.portfolioId,
          variables.year,
        ]);
      },
    },
  );
};
