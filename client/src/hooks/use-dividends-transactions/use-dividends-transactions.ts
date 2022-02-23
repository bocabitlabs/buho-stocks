import { useMutation, useQuery } from "react-query";
import { toast } from "react-toastify";
import axios from "axios";
import { getAxiosOptionsWithAuth } from "api/api-client";
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
  const { data } = await axios.get<IDividendsTransaction[]>(
    `/api/v1/companies/${companyId}/dividends/`,
    getAxiosOptionsWithAuth(),
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
  const { data } = await axios.get(
    `/api/v1/companies/${companyId}/dividends/${transactionId}/`,
    getAxiosOptionsWithAuth(),
  );
  return data;
};

export const useAddDividendsTransaction = () => {
  return useMutation(
    ({ companyId, newTransaction }: AddTransactionMutationProps) =>
      axios.post(
        `/api/v1/companies/${companyId}/dividends/`,
        newTransaction,
        getAxiosOptionsWithAuth(),
      ),
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
      axios.delete(
        `/api/v1/companies/${companyId}/dividends/${transactionId}/`,
        getAxiosOptionsWithAuth(),
      ),
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
      axios.put(
        `/api/v1/companies/${companyId}/dividends/${transactionId}/`,
        newTransaction,
        getAxiosOptionsWithAuth(),
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
