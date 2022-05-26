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
  companyId: number;
  transactionId: number;
}

interface IAddRightsMutationProps {
  newTransaction: IRightsTransactionFormFields;
  companyId: number;
}

interface IDeleteTransactionMutationProps {
  transactionId: number;
  companyId: number;
}

export const fetchRightsTransactions = async (
  companyId: number | undefined,
) => {
  if (!companyId) {
    throw new Error("companyId is required");
  }
  const { data } = await apiClient.get<IRightsTransaction[]>(
    `/companies/${companyId}/rights/`,
  );
  return data;
};

export const fetchRightsTransaction = async (
  companyId: number | undefined,
  transactionId: number | undefined,
) => {
  if (!companyId && !transactionId) {
    throw new Error("companyId and transactionId are required");
  }
  const { data } = await apiClient.get<IRightsTransaction>(
    `/companies/${companyId}/rights/${transactionId}/`,
  );
  return data;
};

export const useAddRightsTransaction = () => {
  return useMutation(
    ({ companyId, newTransaction }: IAddRightsMutationProps) =>
      apiClient.post(`/companies/${companyId}/rights/`, newTransaction),
    {
      onSuccess: (data, variables) => {
        toast.success(`Rights added successfully`);
        queryClient.invalidateQueries([
          "rightsTransactions",
          variables.companyId,
        ]);
      },
      onError: () => {
        toast.error(`Unable to add rights`);
      },
    },
  );
};

export const useUpdateRightsTransaction = () => {
  return useMutation(
    ({
      companyId,
      transactionId,
      newTransaction,
    }: IUpdateRightsMutationProps) =>
      apiClient.put(
        `/companies/${companyId}/rights/${transactionId}/`,
        newTransaction,
      ),
    {
      onSuccess: (data, variables) => {
        toast.success(`Rights updated successfully`);
        queryClient.invalidateQueries([
          "rightsTransactions",
          variables.companyId,
        ]);
      },
      onError: () => {
        toast.error(`Unable to update transaction`);
      },
    },
  );
};

export const useDeleteRightsTransaction = () => {
  return useMutation(
    ({ companyId, transactionId }: IDeleteTransactionMutationProps) =>
      apiClient.delete(
        `/api/v1/companies/${companyId}/rights/${transactionId}/`,
      ),
    {
      onSuccess: (data, variables) => {
        toast.success(`Rights deleted successfully`);
        queryClient.invalidateQueries([
          "rightsTransactions",
          variables.companyId,
        ]);
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

export function useRightsTransaction(
  companyId: number | undefined,
  transactionId: number | undefined,
) {
  return useQuery<IRightsTransaction, Error>(
    ["rightsTransactions", companyId, transactionId],
    () => fetchRightsTransaction(companyId, transactionId),
    {
      enabled: !!companyId && !!transactionId,
    },
  );
}
