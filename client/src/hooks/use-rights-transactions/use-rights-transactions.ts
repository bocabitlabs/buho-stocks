import { useTranslation } from "react-i18next";
import { notifications } from "@mantine/notifications";
import { useMutation, useQuery } from "@tanstack/react-query";
import { MRT_PaginationState } from "mantine-react-table";
import { apiClient } from "api/api-client";
import queryClient from "api/query-client";
import {
  IRightsTransaction,
  IRightsTransactionFormFields,
} from "types/rights-transaction";

interface IUpdateRightsMutationProps {
  newTransaction: IRightsTransactionFormFields;
  transactionId: number;
  updatePortfolio: boolean | undefined;
}

interface IAddRightsMutationProps {
  newTransaction: IRightsTransactionFormFields;
  updatePortfolio: boolean | undefined;
}

interface IDeleteTransactionMutationProps {
  transactionId: number;
}

interface MutateProps {
  onSuccess?: () => void;
  onError?: () => void;
}

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

export const useAddRightsTransaction = (props?: MutateProps) => {
  const { t } = useTranslation();
  return useMutation({
    mutationFn: ({
      newTransaction,
      updatePortfolio,
    }: IAddRightsMutationProps) => {
      let updatePortfolioQuery = "";
      if (updatePortfolio) {
        updatePortfolioQuery = `?updatePortfolio=true`;
      }
      return apiClient.post(`/rights/${updatePortfolioQuery}`, newTransaction);
    },

    onSuccess: () => {
      props?.onSuccess?.();
      notifications.show({
        color: "green",
        message: t("Rights added successfully"),
      });
      queryClient.invalidateQueries({ queryKey: ["rightsTransactions"] });
      queryClient.invalidateQueries({ queryKey: ["portfolios"] });
      queryClient.invalidateQueries({ queryKey: ["companyYearStats"] });
    },
    onError: () => {
      props?.onError?.();
      notifications.show({
        color: "red",
        message: t("Unable to add rights"),
      });
    },
  });
};

export const useUpdateRightsTransaction = (props?: MutateProps) => {
  const { t } = useTranslation();
  return useMutation({
    mutationFn: ({
      transactionId,
      newTransaction,
      updatePortfolio,
    }: IUpdateRightsMutationProps) => {
      let updatePortfolioQuery = "";
      if (updatePortfolio) {
        updatePortfolioQuery = `?updatePortfolio=true`;
      }

      return apiClient.put(
        `/rights/${transactionId}/${updatePortfolioQuery}`,
        newTransaction,
      );
    },

    onSuccess: () => {
      props?.onSuccess?.();
      notifications.show({
        color: "green",
        message: t("Rights updated successfully"),
      });
      queryClient.invalidateQueries({ queryKey: ["rightsTransactions"] });
      queryClient.invalidateQueries({ queryKey: ["portfolios"] });
      queryClient.invalidateQueries({ queryKey: ["companyYearStats"] });
    },
    onError: () => {
      props?.onError?.();

      notifications.show({
        color: "red",
        message: t("Unable to update transaction"),
      });
    },
  });
};

export const useDeleteRightsTransaction = () => {
  const { t } = useTranslation();
  return useMutation({
    mutationFn: ({ transactionId }: IDeleteTransactionMutationProps) =>
      apiClient.delete(`/rights/${transactionId}/?updatePortfolio=true`),
    onSuccess: () => {
      notifications.show({
        color: "green",
        message: t("Rights deleted successfully"),
      });
      queryClient.invalidateQueries({ queryKey: ["rightsTransactions"] });
      queryClient.invalidateQueries({ queryKey: ["portfolios"] });
      queryClient.invalidateQueries({ queryKey: ["companyYearStats"] });
    },
    onError: () => {
      notifications.show({
        color: "red",
        message: t("Unable to delete transaction"),
      });
    },
  });
};

type RightsApiResponse = {
  results: Array<IRightsTransaction>;
  count: number;
  next: number | null;
  previous: number | null;
};

export const fetchRightsTransactions = async (
  companyId: number | undefined,
  pagination: MRT_PaginationState,
) => {
  if (!companyId) {
    throw new Error("companyId is required");
  }

  const fetchURL = new URL("/api/v1/rights/", apiClient.defaults.baseURL);
  fetchURL.searchParams.set("company", `${companyId}`);

  if (pagination) {
    fetchURL.searchParams.set(
      "offset",
      `${pagination.pageIndex * pagination.pageSize}`,
    );
    fetchURL.searchParams.set("limit", `${pagination.pageSize}`);
  }
  const { data } = await apiClient.get<RightsApiResponse>(fetchURL.href);
  return data;
};

export function useRightsTransactions(
  companyId: number | undefined,
  pagination: MRT_PaginationState,
) {
  return useQuery<RightsApiResponse, Error>({
    queryKey: ["rightsTransactions", companyId, pagination],
    queryFn: () => fetchRightsTransactions(companyId, pagination),
    enabled: !!companyId,
  });
}

export function useRightsTransaction(transactionId: number | undefined) {
  return useQuery<IRightsTransaction, Error>({
    queryKey: ["rightsTransactions", transactionId],
    queryFn: () => fetchRightsTransaction(transactionId),
    enabled: !!transactionId,
  });
}
