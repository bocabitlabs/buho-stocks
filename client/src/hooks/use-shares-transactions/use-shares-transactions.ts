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
  companyId: number;
  transactionId: number;
}

interface IAddSharesMutationProps {
  newTransaction: ISharesTransactionFormFields;
  companyId: number;
}

interface DeleteTransactionMutationProps {
  transactionId: number;
  companyId: number;
}

export const fetchSharesTransactions = async (
  companyId: number | undefined,
) => {
  if (!companyId) {
    throw new Error("companyId is required");
  }
  const { data } = await apiClient.get<ISharesTransaction[]>(
    `/companies/${companyId}/shares/`,
  );
  return data;
};

export const fetchSharesTransaction = async (
  companyId: number | undefined,
  transactionId: number | undefined,
) => {
  if (!companyId && !transactionId) {
    throw new Error("companyId and transactionId are required");
  }
  const { data } = await apiClient.get<ISharesTransaction>(
    `/companies/${companyId}/shares/${transactionId}/`,
  );
  return data;
};

export const useAddSharesTransaction = () => {
  return useMutation(
    ({ companyId, newTransaction }: IAddSharesMutationProps) =>
      apiClient.post(`/companies/${companyId}/shares/`, newTransaction),
    {
      onSuccess: (data, variables) => {
        queryClient.invalidateQueries([
          "sharesTransactions",
          variables.companyId,
        ]);
      },
      onError: () => {
        toast.error("Unable to add shares transaction");
      },
    },
  );
};

export const useDeleteSharesTransaction = () => {
  return useMutation(
    ({ companyId, transactionId }: DeleteTransactionMutationProps) =>
      apiClient.delete(`/companies/${companyId}/shares/${transactionId}/`),
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
    ({
      companyId,
      transactionId,
      newTransaction,
    }: IUpdateSharesMutationProps) =>
      apiClient.put(
        `/companies/${companyId}/shares/${transactionId}/`,
        newTransaction,
      ),
    {
      onSuccess: (data, variables) => {
        toast.success("Shares transaction updated successfully");
        queryClient.invalidateQueries([
          "sharesTransactions",
          variables.companyId,
        ]);
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
  companyId: number | undefined,
  transactionId: number | undefined,
  options?: any,
) {
  return useQuery<ISharesTransaction, Error>(
    ["sharesTransactions", companyId, transactionId],
    () => fetchSharesTransaction(companyId, transactionId),
    {
      enabled: !!companyId && !!transactionId,
      ...options,
    },
  );
}
