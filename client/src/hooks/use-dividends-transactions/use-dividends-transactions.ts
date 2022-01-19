import { useMutation, useQuery, useQueryClient } from "react-query";
import axios from "axios";
import { getAxiosOptionsWithAuth } from "api/api-client";
import { IDividendsTransactionFormFields } from "types/dividends-transaction";

interface AddTransactionMutationProps {
  newTransaction: IDividendsTransactionFormFields;
  companyId: number;
}

interface UpdateTransactionMutationProps {
  newTransaction: IDividendsTransactionFormFields;
  companyId: number;
  transactionId: number;
}

interface DeleteTransactionMutationProps {
  transactionId: number;
  companyId: number;
}

export const fetchDividendsTransactions = async (
  companyId: number | undefined,
) => {
  if (!companyId) {
    throw new Error("companyId is required");
  }
  const { data } = await axios.get(
    `/api/v1/companies/${companyId}/dividends/`,
    getAxiosOptionsWithAuth(),
  );
  return data;
};

// export const fetchSharesTransaction = async (marketId: number | undefined) => {
//   if (!marketId) {
//     throw new Error("marketId is required");
//   }
//   const { data } = await axios.get(
//     `/api/v1/markets/${marketId}/`,
//     getAxiosOptionsWithAuth(),
//   );
//   return data;
// };

export const useAddDividendsTransaction = () => {
  const queryClient = useQueryClient();

  return useMutation(
    ({ companyId, newTransaction }: AddTransactionMutationProps) =>
      axios.post(
        `/api/v1/companies/${companyId}/dividends/`,
        newTransaction,
        getAxiosOptionsWithAuth(),
      ),
    {
      onSuccess: (data, variables) => {
        queryClient.invalidateQueries([
          "dividendsTransactions",
          variables.companyId,
        ]);
      },
    },
  );
};

export const useDeleteDividendsTransaction = () => {
  const queryClient = useQueryClient();

  return useMutation(
    ({ companyId, transactionId }: DeleteTransactionMutationProps) =>
      axios.delete(
        `/api/v1/companies/${companyId}/dividends/${transactionId}/`,
        getAxiosOptionsWithAuth(),
      ),
    {
      onSuccess: (data, variables) => {
        queryClient.invalidateQueries([
          "dividendsTransactions",
          variables,
          variables.transactionId,
        ]);
      },
    },
  );
};

export const useUpdateDividendsTransaction = () => {
  const queryClient = useQueryClient();

  return useMutation(
    ({
      companyId,
      transactionId,
      newTransaction,
    }: UpdateTransactionMutationProps) =>
      axios.put(
        `/api/v1/companies/${companyId}/dividends/${transactionId}/`,
        newTransaction,
        getAxiosOptionsWithAuth(),
      ),
    {
      onSuccess: (data, variables) => {
        queryClient.invalidateQueries([
          "dividendsTransactions",
          variables.companyId,
          variables.transactionId,
        ]);
      },
    },
  );
};

export function useDividendsTransactions(companyId: number | undefined) {
  return useQuery(
    ["dividendsTransactions", companyId],
    () => fetchDividendsTransactions(companyId),
    { enabled: !!companyId },
  );
}

// export function useMarket(marketId: number | undefined) {
//   console.log(`Calling useMarket with marketId: ${marketId}`);
//   return useQuery("market", () => fetchMarket(marketId), {
//     // The query will not execute until the userId exists
//     enabled: !!marketId,
//   });
// }
