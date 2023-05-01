import { useMutation, useQuery } from "react-query";
import { apiClient } from "api/api-client";
import queryClient from "api/query-client";

export const fetchStats = async (
  companyId: number | undefined,
  year: string | undefined,
) => {
  const { data } = await apiClient.get(
    `/stats/company/${companyId}/year/${year}/`,
  );
  return data;
};

export function useCompanyYearStats(
  companyId: number | undefined,
  year: string | undefined,
  otherOptions?: any,
) {
  return useQuery(
    ["companyYearStats", companyId, year],
    () => fetchStats(companyId, year),
    {
      enabled: !!companyId && !!year,
      ...otherOptions,
    },
  );
}

interface IUpdateYearStatsMutationProps {
  companyId: number | undefined;
  year: string | undefined;
  updateApiPrice: boolean | undefined;
}

export const useUpdateYearStats = () => {
  return useMutation(
    ({ companyId, year, updateApiPrice }: IUpdateYearStatsMutationProps) =>
      apiClient.put(`/stats/company/${companyId}/year/${year}/`, {
        updateApiPrice,
      }),
    {
      onSuccess: (data, variables) => {
        queryClient.invalidateQueries([
          "companyYearStats",
          variables.companyId,
          variables.year,
        ]);
      },
    },
  );
};
