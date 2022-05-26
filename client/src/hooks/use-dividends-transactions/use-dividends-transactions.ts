import { useMutation, useQuery } from "react-query";
import { toast } from "react-toastify";
import { apiClient } from "api/api-client";
import queryClient from "api/query-client";
import {
  IDividendsTransaction,
  IDividendsTransactionFormFields,
} from "types/dividends-transaction";

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
  const { data } = await apiClient.get<IDividendsTransaction[]>(
    `/companies/${companyId}/dividends/`,
  );
  return data;
};

export const fetchTransaction = async (
  companyId: number | undefined,
  transactionId: number | undefined,
) => {
  if (!companyId || !transactionId) {
    throw new Error("companyId and transactionId are required");
  }
  const { data } = await apiClient.get(
    `/companies/${companyId}/dividends/${transactionId}/`,
  );
  return data;
};

export const useAddDividendsTransaction = () => {
  return useMutation(
    ({ companyId, newTransaction }: AddTransactionMutationProps) =>
      apiClient.post(`/companies/${companyId}/dividends/`, newTransaction),
    {
      onSuccess: (data, variables) => {
        toast.success("Transaction created successfully");
        queryClient.invalidateQueries([
          "dividendsTransactions",
          variables.companyId,
        ]);
      },
      onError: () => {
        toast.error("Unable to create transaction");
      },
    },
  );
};

export const useDeleteDividendsTransaction = () => {
  return useMutation(
    ({ companyId, transactionId }: DeleteTransactionMutationProps) =>
      apiClient.delete(`/companies/${companyId}/dividends/${transactionId}/`),
    {
      onSuccess: (data, variables) => {
        toast.success("Transaction deleted");
        queryClient.invalidateQueries([
          "dividendsTransactions",
          variables.companyId,
        ]);
      },
      onError: () => {
        toast.error("Unable to delete dividends transaction");
      },
    },
  );
};

export const useUpdateDividendsTransaction = () => {
  return useMutation(
    ({
      companyId,
      transactionId,
      newTransaction,
    }: UpdateTransactionMutationProps) =>
      apiClient.put(
        `/companies/${companyId}/dividends/${transactionId}/`,
        newTransaction,
      ),
    {
      onSuccess: (data, variables) => {
        toast.success("Transaction updated");
        queryClient.invalidateQueries([
          "dividendsTransactions",
          variables.companyId,
        ]);
      },
      onError: () => {
        toast.error("Unable to update dividends transaction");
      },
    },
  );
};

export function useDividendsTransactions(companyId: number | undefined) {
  return useQuery<IDividendsTransaction[], Error>(
    ["dividendsTransactions", companyId],
    () => fetchDividendsTransactions(companyId),
    { enabled: !!companyId },
  );
}

export function useDividendsTransaction(
  companyId: number | undefined,
  transactionId: number | undefined,
  options?: any,
) {
  return useQuery<IDividendsTransaction, Error>(
    ["dividendsTransactions", companyId, transactionId],
    () => fetchTransaction(companyId, transactionId),
    {
      // The query will not execute until the userId exists
      enabled: !!companyId && !!transactionId,
      ...options,
    },
  );
}
