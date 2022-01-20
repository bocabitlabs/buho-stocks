import { useMutation } from "react-query";
import axios from "axios";
import { getAxiosOptionsWithAuth } from "api/api-client";
import queryClient from "api/query-client";

interface IUpdateYearStatsMutationProps {
  companyId: number | undefined;
  year: string | undefined;
}

export const useUpdateCompanyStockPrice = () => {
  return useMutation(
    ({ companyId, year }: IUpdateYearStatsMutationProps) =>
      axios.put(
        `/api/v1/companies/${companyId}/stock-prices/${year}/`,
        {},
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
