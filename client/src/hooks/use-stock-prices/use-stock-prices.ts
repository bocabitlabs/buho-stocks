import { useMutation } from "react-query";
import { apiClient } from "api/api-client";
import queryClient from "api/query-client";

interface IUpdateYearStatsMutationProps {
  companyId: number | undefined;
  year: string | undefined;
}

export const useUpdateCompanyStockPrice = () => {
  return useMutation(
    ({ companyId, year }: IUpdateYearStatsMutationProps) =>
      apiClient.put(`/companies/${companyId}/stock-prices/${year}/`, {}),
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

export default useUpdateCompanyStockPrice;
