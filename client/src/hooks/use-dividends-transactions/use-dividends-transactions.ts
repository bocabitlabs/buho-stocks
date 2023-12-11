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
  updatePortfolio: boolean | undefined;
}

interface UpdateTransactionMutationProps {
  newTransaction: IDividendsTransactionFormFields;
  transactionId: number;
}

interface DeleteTransactionMutationProps {
  transactionId: number;
}

export const fetchDividendsTransactions = async (
  companyId: number | undefined,
) => {
  if (!companyId) {
    throw new Error("companyId is required");
  }
  const { data } = await apiClient.get<IDividendsTransaction[]>(
    `/dividends/?company=${companyId}`,
  );
  return data;
};

export const fetchTransaction = async (transactionId: number | undefined) => {
  if (!transactionId) {
    throw new Error("companyId and transactionId are required");
  }
  const { data } = await apiClient.get(`/dividends/${transactionId}/`);
  return data;
};

export const useAddDividendsTransaction = () => {
  return useMutation(
    ({ newTransaction, updatePortfolio }: AddTransactionMutationProps) => {
      let updatePortfolioQuery = "";
      if (updatePortfolio) {
        updatePortfolioQuery = `?updatePortfolio=true`;
      }
      return apiClient.post(
        `/dividends/${updatePortfolioQuery}`,
        newTransaction,
      );
    },
    {
      onSuccess: () => {
        toast.success("Transaction created successfully");
        queryClient.invalidateQueries(["dividendsTransactions"]);
      },
      onError: () => {
        toast.error("Unable to create transaction");
      },
    },
  );
};

export const useDeleteDividendsTransaction = () => {
  return useMutation(
    ({ transactionId }: DeleteTransactionMutationProps) =>
      apiClient.delete(`/dividends/${transactionId}/`),
    {
      onSuccess: () => {
        toast.success("Transaction deleted");
        queryClient.invalidateQueries(["dividendsTransactions"]);
      },
      onError: () => {
        toast.error("Unable to delete dividends transaction");
      },
    },
  );
};

export const useUpdateDividendsTransaction = () => {
  return useMutation(
    ({ transactionId, newTransaction }: UpdateTransactionMutationProps) =>
      apiClient.put(`/dividends/${transactionId}/`, newTransaction),
    {
      onSuccess: () => {
        toast.success("Transaction updated");
        queryClient.invalidateQueries(["dividendsTransactions"]);
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
  transactionId: number | undefined,
  options?: any,
) {
  return useQuery<IDividendsTransaction, Error>(
    ["dividendsTransactions", transactionId],
    () => fetchTransaction(transactionId),
    {
      // The query will not execute until the userId exists
      enabled: !!transactionId,
      ...options,
    },
  );
}
