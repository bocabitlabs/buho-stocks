import { useTranslation } from "react-i18next";
import { notifications } from "@mantine/notifications";
import { QueryOptions, useMutation, useQuery } from "@tanstack/react-query";
import { apiClient } from "api/api-client";
import queryClient from "api/query-client";
import { CompanyYearStats } from "types/company-year-stats";

export const fetchStats = async (
  companyId: number | undefined | null,
  year: string | undefined | null,
) => {
  if (!companyId || !year) {
    throw new Error("Company ID and year are required");
  }
  const { data } = await apiClient.get<CompanyYearStats>(
    `/stats/company/${companyId}/year/${year}/`,
  );
  return data;
};

export function useCompanyYearStats(
  companyId: number | undefined | null,
  year: string | undefined | null,
  otherOptions?: QueryOptions<CompanyYearStats, Error>,
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

interface MutateProps {
  onSuccess?: () => void;
  onError?: () => void;
}

export const useUpdateYearStats = (props?: MutateProps) => {
  const { t } = useTranslation();
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
      props?.onSuccess?.();
      notifications.show({
        color: "green",
        message: t("Company stats update requested"),
      });
      queryClient.invalidateQueries({
        queryKey: ["companyYearStats", variables.companyId, variables.year],
      });
    },
    onError: () => {
      props?.onError?.();
      notifications.show({
        color: "red",
        message: t("Company stats update failed"),
      });
    },
  });
};
