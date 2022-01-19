import { useMutation, useQuery, useQueryClient } from "react-query";
import axios from "axios";
import { getAxiosOptionsWithAuth } from "api/api-client";

export const fetchStats = async (
  companyId: number | undefined,
  year: string | undefined,
) => {
  const { data } = await axios.get(
    `/api/v1/stats/company/${companyId}/year/${year}/`,
    getAxiosOptionsWithAuth(),
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
}

export const useUpdateYearStatsForced = () => {
  const queryClient = useQueryClient();

  return useMutation(
    ({ companyId, year }: IUpdateYearStatsMutationProps) =>
      axios.get(
        `/api/v1/stats/company/${companyId}/year/${year}/force/`,
        getAxiosOptionsWithAuth(),
      ),
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
