import { useMutation, useQueryClient } from "react-query";
import axios from "axios";
import { getAxiosOptionsWithAuth } from "api/api-client";

interface IUpdateYearStatsMutationProps {
  companyId: number | undefined;
  year: string | undefined;
}

export const useUpdateCompanyStockPrice = () => {
  const queryClient = useQueryClient();

  return useMutation(
    ({ companyId, year }: IUpdateYearStatsMutationProps) =>
      axios.get(
        `/api/v1/companies/${companyId}/stock-prices/${year}/last/force/`,
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

export default useUpdateCompanyStockPrice;
