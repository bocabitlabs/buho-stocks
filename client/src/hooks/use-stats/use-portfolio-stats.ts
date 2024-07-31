import { useMutation, useQuery } from "@tanstack/react-query";
import { apiClient } from "api/api-client";
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
  const { data } = await apiClient.get<IPortfolioYearStats>(
    `/stats/portfolio/${portfolioId}/year/${year}/${grouping}`,
  );
  return data;
};

export const fetchAllYearsStats = async (portfolioId: number | undefined) => {
  const { data } = await apiClient.get<IPortfolioYearStats[]>(
    `/stats/portfolio/${portfolioId}/`,
  );
  return data;
};

/**
 * Get the portfolio stats for a given year
 * @param portfolioId Portfolio ID
 * @param year Year of the stats: 2020, 2021, etc. or 'all'
 * @param groupBy month, company, undefined
 * @param otherOptions
 * @returns A IPortfolioYearStats object
 */
export function usePortfolioYearStats(
  portfolioId: number | undefined,
  year: string | undefined,
  groupBy?: string | undefined,
  otherOptions?: any,
) {
  return useQuery<IPortfolioYearStats, Error>({
    queryKey: ["portfolioYearStats", portfolioId, year, groupBy],
    queryFn: () => fetchYearStats(portfolioId, year, groupBy),
    enabled: !!portfolioId && !!year,
    ...otherOptions,
  });
}

export function usePortfolioAllYearStats(
  portfolioId: number | undefined,
  otherOptions?: any,
) {
  return useQuery<IPortfolioYearStats[], Error>({
    queryKey: ["portfolioAllYearsStats", portfolioId],
    queryFn: () => fetchAllYearsStats(portfolioId),

    enabled: !!portfolioId,
    ...otherOptions,
  });
}

interface IUpdateYearStatsMutationProps {
  portfolioId: number | undefined;
  year: string | undefined;
  updateApiPrice: boolean | undefined;
  companiesIds?: number[];
}

export const useUpdatePortfolioYearStats = () => {
  return useMutation({
    mutationFn: ({
      portfolioId,
      year,
      updateApiPrice,
      companiesIds,
    }: IUpdateYearStatsMutationProps) => {
      let companiesIdsQuery = "";
      if (companiesIds) {
        companiesIdsQuery = `?companiesIds=${companiesIds.join(",")}`;
      }

      return apiClient.put(
        `/stats/portfolio/${portfolioId}/year/${year}/${companiesIdsQuery}`,
        {
          updateApiPrice,
        },
      );
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["portfolioYearStats", variables.portfolioId, variables.year],
      });
    },
  });
};
