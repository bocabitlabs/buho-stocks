import { useMutation, useQuery } from "react-query";
import { toast } from "react-toastify";
import { apiClient } from "api/api-client";
import queryClient from "api/query-client";
import {
  IRightsTransaction,
  IRightsTransactionFormFields,
} from "types/rights-transaction";

interface IUpdateRightsMutationProps {
  newTransaction: IRightsTransactionFormFields;
  transactionId: number;
}

interface IAddRightsMutationProps {
  newTransaction: IRightsTransactionFormFields;
}

interface IDeleteTransactionMutationProps {
  transactionId: number;
}

export const fetchRightsTransactions = async (
  companyId: number | undefined,
) => {
  if (!companyId) {
    throw new Error("companyId is required");
  }
  const { data } = await apiClient.get<IRightsTransaction[]>(
    `/rights/?company=${companyId}`,
  );
  return data;
};

export const fetchRightsTransaction = async (
  transactionId: number | undefined,
) => {
  if (!transactionId) {
    throw new Error("companyId and transactionId are required");
  }
  const { data } = await apiClient.get<IRightsTransaction>(
    `/rights/${transactionId}/`,
  );
  return data;
};

export const useAddRightsTransaction = () => {
  return useMutation(
    ({ newTransaction }: IAddRightsMutationProps) =>
      apiClient.post(`/rights/`, newTransaction),
    {
      onSuccess: () => {
        toast.success(`Rights added successfully`);
        queryClient.invalidateQueries(["rightsTransactions"]);
      },
      onError: () => {
        toast.error(`Unable to add rights`);
      },
    },
  );
};

export const useUpdateRightsTransaction = () => {
  return useMutation(
    ({ transactionId, newTransaction }: IUpdateRightsMutationProps) =>
      apiClient.put(`/rights/${transactionId}/`, newTransaction),
    {
      onSuccess: () => {
        toast.success(`Rights updated successfully`);
        queryClient.invalidateQueries(["rightsTransactions"]);
      },
      onError: () => {
        toast.error(`Unable to update transaction`);
      },
    },
  );
};

export const useDeleteRightsTransaction = () => {
  return useMutation(
    ({ transactionId }: IDeleteTransactionMutationProps) =>
      apiClient.delete(`/rights/${transactionId}/`),
    {
      onSuccess: () => {
        toast.success(`Rights deleted successfully`);
        queryClient.invalidateQueries(["rightsTransactions"]);
      },
      onError: () => {
        toast.error("Unable to delete transaction");
      },
    },
  );
};

export function useRightsTransactions(companyId: number | undefined) {
  return useQuery<IRightsTransaction[], Error>(
    ["rightsTransactions", companyId],
    () => fetchRightsTransactions(companyId),
    { enabled: !!companyId },
  );
}

export function useRightsTransaction(transactionId: number | undefined) {
  return useQuery<IRightsTransaction, Error>(
    ["rightsTransactions", transactionId],
    () => fetchRightsTransaction(transactionId),
    {
      enabled: !!transactionId,
    },
  );
}
