import { useMutation, useQuery } from "@tanstack/react-query";
import { apiClient } from "api/api-client";
import queryClient from "api/query-client";
import { CompanyYearStats } from "types/company-year-stats";

export const fetchStats = async (
  companyId: number | undefined,
  year: string | undefined,
) => {
  const { data } = await apiClient.get<CompanyYearStats>(
    `/stats/company/${companyId}/year/${year}/`,
  );
  return data;
};

export function useCompanyYearStats(
  companyId: number | undefined,
  year: string | undefined,
  otherOptions?: any,
) {
  return useQuery<CompanyYearStats, Error>({
    queryKey: ["companyYearStats", companyId, year],
    queryFn: () => fetchStats(companyId, year),
    enabled: !!companyId && !!year,
    ...otherOptions,
  });
}

interface IUpdateYearStatsMutationProps {
  companyId: number | undefined;
  year: string | undefined;
  updateApiPrice: boolean | undefined;
}

export const useUpdateYearStats = () => {
  return useMutation({
    mutationFn: ({
      companyId,
      year,
      updateApiPrice,
    }: IUpdateYearStatsMutationProps) =>
      apiClient.put(`/stats/company/${companyId}/year/${year}/`, {
        updateApiPrice,
      }),

    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["companyYearStats", variables.companyId, variables.year],
      });
    },
  });
};
