import { useMutation, useQuery, useQueryClient } from "react-query";
import axios from "axios";
import { getAxiosOptionsWithAuth } from "api/api-client";

export const fetchStats = async (
  portfolioId: number | undefined,
  year: string | undefined,
  groupBy?: string | undefined,
) => {
  let grouping = "";
  if (groupBy) {
    grouping = `?groupBy=${groupBy}`;
  }
  const { data } = await axios.get(
    `/api/v1/stats/portfolio/${portfolioId}/year/${year}/${grouping}`,
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
  return useQuery(
    ["portfolioYearStats", portfolioId, year, groupBy],
    () => fetchStats(portfolioId, year, groupBy),
    {
      enabled: !!portfolioId && !!year,
      ...otherOptions,
    },
  );
}

interface IUpdateYearStatsMutationProps {
  portfolioId: number | undefined;
  year: string | undefined;
}

export const useUpdatePortfolioYearStatsForced = () => {
  const queryClient = useQueryClient();

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
