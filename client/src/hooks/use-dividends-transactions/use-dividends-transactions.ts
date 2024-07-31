import { toast } from "react-toastify";
import { keepPreviousData, useMutation, useQuery } from "@tanstack/react-query";
import { MRT_PaginationState } from "mantine-react-table";
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
  updatePortfolio: boolean | undefined;
}

interface DeleteTransactionMutationProps {
  transactionId: number;
}

interface MutateProps {
  onSuccess?: Function;
  onError?: Function;
}

export const fetchTransaction = async (transactionId: number | undefined) => {
  if (!transactionId) {
    throw new Error("companyId and transactionId are required");
  }
  const { data } = await apiClient.get(`/dividends/${transactionId}/`);
  return data;
};

export const useAddDividendsTransaction = (props?: MutateProps) => {
  return useMutation({
    mutationFn: ({
      newTransaction,
      updatePortfolio,
    }: AddTransactionMutationProps) => {
      let updatePortfolioQuery = "";
      if (updatePortfolio) {
        updatePortfolioQuery = `?updatePortfolio=true`;
      }
      return apiClient.post(
        `/dividends/${updatePortfolioQuery}`,
        newTransaction,
      );
    },
    onSuccess: () => {
      props?.onSuccess?.();
      toast.success("Transaction created successfully");
      queryClient.invalidateQueries({ queryKey: ["dividendsTransactions"] });
    },
    onError: () => {
      toast.error("Unable to create transaction");
    },
  });
};

export const useDeleteDividendsTransaction = () => {
  return useMutation({
    mutationFn: ({ transactionId }: DeleteTransactionMutationProps) =>
      apiClient.delete(`/dividends/${transactionId}/`),
    onSuccess: () => {
      toast.success("Transaction deleted");
      queryClient.invalidateQueries({ queryKey: ["dividendsTransactions"] });
    },
    onError: () => {
      toast.error("Unable to delete dividends transaction");
    },
  });
};

export const useUpdateDividendsTransaction = (props?: MutateProps) => {
  return useMutation({
    mutationFn: ({
      transactionId,
      newTransaction,
      updatePortfolio,
    }: UpdateTransactionMutationProps) => {
      let updatePortfolioQuery = "";
      if (updatePortfolio) {
        updatePortfolioQuery = `?updatePortfolio=true`;
      }

      return apiClient.put(
        `/dividends/${transactionId}/${updatePortfolioQuery}`,
        newTransaction,
      );
    },

    onSuccess: () => {
      props?.onSuccess?.();
      toast.success("Transaction updated");
      queryClient.invalidateQueries({ queryKey: ["dividendsTransactions"] });
    },
    onError: () => {
      props?.onError?.();
      toast.error("Unable to update dividends transaction");
    },
  });
};

type DividendsApiResponse = {
  results: Array<IDividendsTransaction>;
  count: number;
  next: number | null;
  previous: number | null;
};

export const fetchDividendsTransactions = async (
  companyId: number | undefined,
  pagination: MRT_PaginationState,
) => {
  if (!companyId) {
    throw new Error("companyId is required");
  }
  const fetchURL = new URL("/api/v1/dividends/", apiClient.defaults.baseURL);
  fetchURL.searchParams.set("company", `${companyId}`);

  if (pagination) {
    fetchURL.searchParams.set(
      "offset",
      `${pagination.pageIndex * pagination.pageSize}`,
    );
    fetchURL.searchParams.set("limit", `${pagination.pageSize}`);
  }
  const { data } = await apiClient.get<DividendsApiResponse>(fetchURL.href);

  return data;
};

export function useDividendsTransactions(
  companyId: number | undefined,
  pagination: MRT_PaginationState,
) {
  return useQuery<DividendsApiResponse, Error>({
    queryKey: ["dividendsTransactions", companyId, pagination],
    queryFn: () => fetchDividendsTransactions(companyId, pagination),
    placeholderData: keepPreviousData,
    staleTime: 30_000,
    enabled: !!companyId,
  });
}

export function useDividendsTransaction(
  transactionId: number | undefined,
  options?: any,
) {
  return useQuery<IDividendsTransaction, Error>({
    queryKey: ["dividendsTransactions", transactionId],
    queryFn: () => fetchTransaction(transactionId),
    // The query will not execute until the userId exists
    enabled: !!transactionId,
    ...options,
  });
}
