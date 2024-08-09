import { useTranslation } from "react-i18next";
import { notifications } from "@mantine/notifications";
import { keepPreviousData, useMutation, useQuery } from "@tanstack/react-query";
import { MRT_PaginationState } from "mantine-react-table";
import { apiClient } from "api/api-client";
import queryClient from "api/query-client";
import {
  ISharesTransaction,
  ISharesTransactionFormFields,
} from "types/shares-transaction";

interface IUpdateSharesMutationProps {
  newTransaction: ISharesTransactionFormFields;
  transactionId: number;
  updatePortfolio: boolean | undefined;
}

interface IAddSharesMutationProps {
  newTransaction: ISharesTransactionFormFields;
  updatePortfolio: boolean | undefined;
}

interface DeleteTransactionMutationProps {
  transactionId: number;
}

interface MutateProps {
  onSuccess?: Function;
  onError?: Function;
}

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

export const useAddSharesTransaction = (props?: MutateProps) => {
  const { t } = useTranslation();
  return useMutation({
    mutationFn: ({
      newTransaction,
      updatePortfolio,
    }: IAddSharesMutationProps) => {
      let updatePortfolioQuery = "";
      if (updatePortfolio) {
        updatePortfolioQuery = `?updatePortfolio=true`;
      }
      return apiClient.post(`/shares/${updatePortfolioQuery}`, newTransaction);
    },
    onSuccess: () => {
      props?.onSuccess?.();
      notifications.show({
        color: "green",
        message: t("Trades added successfully"),
      });
      queryClient.invalidateQueries({ queryKey: ["sharesTransactions"] });
    },
    onError: () => {
      props?.onError?.();
      notifications.show({
        color: "red",
        message: t("Unable to add shares transaction"),
      });
    },
  });
};

export const useDeleteSharesTransaction = () => {
  const { t } = useTranslation();
  return useMutation({
    mutationFn: ({ transactionId }: DeleteTransactionMutationProps) =>
      apiClient.delete(`/shares/${transactionId}/`),
    onSuccess: () => {
      notifications.show({
        color: "green",
        message: t("Shares transaction deleted successfully"),
      });
      queryClient.invalidateQueries({ queryKey: ["sharesTransactions"] });
    },
    onError: () => {
      notifications.show({
        color: "red",
        message: t("Unable to delete"),
      });
    },
  });
};

export const useUpdateSharesTransaction = (props?: MutateProps) => {
  const { t } = useTranslation();
  return useMutation({
    mutationFn: ({
      transactionId,
      newTransaction,
      updatePortfolio,
    }: IUpdateSharesMutationProps) => {
      let updatePortfolioQuery = "";
      if (updatePortfolio) {
        updatePortfolioQuery = `?updatePortfolio=true`;
      }

      return apiClient.put(
        `/shares/${transactionId}/${updatePortfolioQuery}`,
        newTransaction,
      );
    },

    onSuccess: () => {
      props?.onSuccess?.();
      notifications.show({
        color: "green",
        message: t("Shares transaction updated successfully"),
      });
      queryClient.invalidateQueries({ queryKey: ["sharesTransactions"] });
    },
    onError: () => {
      props?.onError?.();
      notifications.show({
        color: "red",
        message: t("Unable to update shares transaction"),
      });
    },
  });
};

type SharesApiResponse = {
  results: Array<ISharesTransaction>;
  count: number;
  next: number | null;
  previous: number | null;
};

export const fetchSharesTransactions = async (
  companyId: number | undefined,
  pagination: MRT_PaginationState,
) => {
  if (!companyId) {
    throw new Error("companyId is required");
  }
  const fetchURL = new URL("/api/v1/shares/", apiClient.defaults.baseURL);
  fetchURL.searchParams.set("company", `${companyId}`);

  if (pagination) {
    fetchURL.searchParams.set(
      "offset",
      `${pagination.pageIndex * pagination.pageSize}`,
    );
    fetchURL.searchParams.set("limit", `${pagination.pageSize}`);
  }
  const { data } = await apiClient.get<SharesApiResponse>(fetchURL.href);

  return data;
};

export function useSharesTransactions(
  companyId: number | undefined,
  pagination: MRT_PaginationState,
) {
  return useQuery<SharesApiResponse, Error>({
    queryKey: ["sharesTransactions", companyId, pagination],
    queryFn: () => fetchSharesTransactions(companyId, pagination),
    placeholderData: keepPreviousData,
    staleTime: 30_000,
    enabled: !!companyId,
  });
}

export function useSharesTransaction(
  transactionId: number | undefined,
  options?: any,
) {
  return useQuery<ISharesTransaction, Error>({
    queryKey: ["sharesTransactions", transactionId],
    queryFn: () => fetchSharesTransaction(transactionId),

    enabled: !!transactionId,
    ...options,
  });
}
