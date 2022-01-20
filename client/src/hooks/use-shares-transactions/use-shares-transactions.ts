import { useMutation, useQuery } from "react-query";
import axios from "axios";
import { getAxiosOptionsWithAuth } from "api/api-client";
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
  const { data } = await axios.get<ISharesTransaction[]>(
    `/api/v1/companies/${companyId}/shares/`,
    getAxiosOptionsWithAuth(),
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
  const { data } = await axios.get<ISharesTransaction>(
    `/api/v1/companies/${companyId}/shares/${transactionId}/`,
    getAxiosOptionsWithAuth(),
  );
  return data;
};

export const useAddSharesTransaction = () => {
  return useMutation(
    ({ companyId, newTransaction }: IAddSharesMutationProps) =>
      axios.post(
        `/api/v1/companies/${companyId}/shares/`,
        newTransaction,
        getAxiosOptionsWithAuth(),
      ),
    {
      onSuccess: (data, variables) => {
        queryClient.invalidateQueries([
          "sharesTransactions",
          variables.companyId,
          variables.newTransaction,
        ]);
      },
    },
  );
};

export const useDeleteSharesTransaction = () => {
  return useMutation(
    ({ companyId, transactionId }: DeleteTransactionMutationProps) =>
      axios.delete(
        `/api/v1/companies/${companyId}/shares/${transactionId}/`,
        getAxiosOptionsWithAuth(),
      ),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["sharesTransactions"]);
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
      axios.post(
        `/api/v1/companies/${companyId}/shares/${transactionId}/`,
        newTransaction,
        getAxiosOptionsWithAuth(),
      ),
    {
      onSuccess: (data, variables) => {
        queryClient.invalidateQueries([
          "sharesTransactions",
          variables.companyId,
          variables.transactionId,
          variables.newTransaction,
        ]);
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
) {
  return useQuery<ISharesTransaction, Error>(
    ["sharesTransactions", companyId, transactionId],
    () => fetchSharesTransaction(companyId, transactionId),
    {
      enabled: !!companyId && !!transactionId,
    },
  );
}
