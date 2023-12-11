import { useMutation, useQuery } from "react-query";
import { toast } from "react-toastify";
import { apiClient } from "api/api-client";
import queryClient from "api/query-client";
import {
  ISharesTransaction,
  ISharesTransactionFormFields,
} from "types/shares-transaction";

interface IUpdateSharesMutationProps {
  newTransaction: ISharesTransactionFormFields;
  transactionId: number;
}

interface IAddSharesMutationProps {
  newTransaction: ISharesTransactionFormFields;
  updatePortfolio: boolean | undefined;
}

interface DeleteTransactionMutationProps {
  transactionId: number;
}

export const fetchSharesTransactions = async (
  companyId: number | undefined,
) => {
  if (!companyId) {
    throw new Error("companyId is required");
  }
  const { data } = await apiClient.get<ISharesTransaction[]>(
    `/shares/?company=${companyId}`,
  );
  return data;
};

export const fetchSharesTransaction = async (
  transactionId: number | undefined,
) => {
  if (!transactionId) {
    throw new Error("transactionId is required");
  }
  const { data } = await apiClient.get<ISharesTransaction>(
    `/shares/${transactionId}/`,
  );
  return data;
};

export const useAddSharesTransaction = () => {
  return useMutation(
    ({ newTransaction, updatePortfolio }: IAddSharesMutationProps) => {
      let updatePortfolioQuery = "";
      if (updatePortfolio) {
        updatePortfolioQuery = `?updatePortfolio=true`;
      }
      return apiClient.post(`/shares/${updatePortfolioQuery}`, newTransaction);
    },
    {
      onSuccess: () => {
        toast.success("Trades added successfully");
        queryClient.invalidateQueries(["sharesTransactions"]);
      },
      onError: () => {
        toast.error("Unable to add shares transaction");
      },
    },
  );
};

export const useDeleteSharesTransaction = () => {
  return useMutation(
    ({ transactionId }: DeleteTransactionMutationProps) =>
      apiClient.delete(`/shares/${transactionId}/`),
    {
      onSuccess: () => {
        toast.success("Shares transaction deleted successfully");
        queryClient.invalidateQueries(["sharesTransactions"]);
      },
      onError: () => {
        toast.error("Unable to delete");
      },
    },
  );
};

export const useUpdateSharesTransaction = () => {
  return useMutation(
    ({ transactionId, newTransaction }: IUpdateSharesMutationProps) =>
      apiClient.put(`/shares/${transactionId}/`, newTransaction),
    {
      onSuccess: () => {
        toast.success("Shares transaction updated successfully");
        queryClient.invalidateQueries(["sharesTransactions"]);
      },
      onError: () => {
        toast.error("Unable to update shares transaction");
      },
    },
  );
};

export function useSharesTransactions(companyId: number | undefined) {
  return useQuery<ISharesTransaction[], Error>(
    ["sharesTransactions", companyId],
    () => fetchSharesTransactions(companyId),
    { enabled: !!companyId },
  );
}

export function useSharesTransaction(
  transactionId: number | undefined,
  options?: any,
) {
  return useQuery<ISharesTransaction, Error>(
    ["sharesTransactions", transactionId],
    () => fetchSharesTransaction(transactionId),
    {
      enabled: !!transactionId,
      ...options,
    },
  );
}
