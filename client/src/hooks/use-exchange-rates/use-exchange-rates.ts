import { useTranslation } from "react-i18next";
import { notifications } from "@mantine/notifications";
import { keepPreviousData, useMutation, useQuery } from "@tanstack/react-query";
import { MRT_PaginationState, MRT_SortingState } from "mantine-react-table";
import { apiClient } from "api/api-client";
import queryClient from "api/query-client";
import { IExchangeRate, IExchangeRateFormFields } from "types/exchange-rate";

interface UpdateMutationProps {
  newExchangeRate: IExchangeRateFormFields;
  id: number | undefined;
}

type ExchangeRateApiResponse = {
  results: Array<IExchangeRate>;
  count: number;
  next: number | null;
  previous: number | null;
};

interface Params {
  sorting: MRT_SortingState;
  pagination: MRT_PaginationState;
}

export const fetchExchangeRate = async (
  fromCurrencyCode: string | undefined,
  toCurrencyCode: string | undefined,
  transactionDate: string | undefined,
) => {
  if (!fromCurrencyCode || !toCurrencyCode || !transactionDate) {
    throw new Error(
      "fromCurrencyCode, toCurrencyCode and transactionDate are required",
    );
  }
  console.log("Making exchange-rates call");
  const { data } = await apiClient.get<IExchangeRate>(
    `/exchange-rates/${fromCurrencyCode}/${toCurrencyCode}/${transactionDate}/`,
  );
  return data;
};

export function useExchangeRate(
  fromCurrencyCode: string | undefined,
  toCurrencyCode: string | undefined,
  transactionDate: string | undefined,
) {
  return useQuery<IExchangeRate, Error>({
    queryKey: [
      "exchange-rates",
      fromCurrencyCode,
      toCurrencyCode,
      transactionDate,
    ],
    queryFn: () =>
      fetchExchangeRate(fromCurrencyCode, toCurrencyCode, transactionDate),
    enabled: false,
  });
}

export const fetchExchangeRates = async (
  pagination: MRT_PaginationState,
  sorting: MRT_SortingState,
) => {
  const fetchURL = new URL(
    "/api/v1/exchange-rates/",
    apiClient.defaults.baseURL,
  );
  if (pagination) {
    fetchURL.searchParams.set(
      "offset",
      `${pagination.pageIndex * pagination.pageSize}`,
    );
    fetchURL.searchParams.set("limit", `${pagination.pageSize}`);
  }

  if (sorting?.length === 0) {
    fetchURL.searchParams.set("sort_by", "exchangeDate");
    fetchURL.searchParams.set("order_by", "asc");
  } else {
    const newSortBy = sorting?.[0].id ?? "exchangeDate";
    fetchURL.searchParams.set("sort_by", newSortBy);
    const newOrderBy = sorting?.[0].desc ? "desc" : "asc";
    fetchURL.searchParams.set("order_by", newOrderBy);
  }

  const { data } = await apiClient.get<ExchangeRateApiResponse>(fetchURL.href);

  return data;
};

export function useExchangeRates({ sorting, pagination }: Params) {
  return useQuery<ExchangeRateApiResponse, Error>({
    queryKey: ["exchange-rates", pagination, sorting],
    queryFn: () => fetchExchangeRates(pagination, sorting),
    placeholderData: keepPreviousData, // useful for paginated queries by keeping data from previous pages on screen while fetching the next page
    staleTime: 30_000, // don't refetch previously viewed pages until cache is more than 30 seconds old
  });
}

export const fetchExchangeRateDetails = async (id: number | undefined) => {
  if (!id) {
    throw new Error("id is required");
  }
  const { data } = await apiClient.get<IExchangeRate>(`/exchange-rates/${id}/`);
  return data;
};

export function useExchangeRateDetails(id: number | undefined) {
  return useQuery<IExchangeRate, Error>({
    queryKey: ["exchange-rates", id],
    queryFn: () => fetchExchangeRateDetails(id),
    enabled: !!id,
  });
}

interface MutateProps {
  onSuccess?: () => void;
  onError?: () => void;
}

export const useAddExchangeRate = (props?: MutateProps) => {
  const { t } = useTranslation();

  return useMutation({
    mutationFn: (newExchangeRate: IExchangeRateFormFields) =>
      apiClient.post(`/exchange-rates/`, newExchangeRate),
    onSuccess: () => {
      props?.onSuccess?.();
      notifications.show({
        color: "green",
        message: t("Exchange rate created"),
      });
      queryClient.invalidateQueries({ queryKey: ["exchange-rates"] });
    },
    onError: () => {
      props?.onError?.();
      notifications.show({
        color: "red",
        message: t("Unable to create exchange rate"),
      });
    },
  });
};

export const useDeleteExchangeRate = () => {
  const { t } = useTranslation();

  return useMutation({
    mutationFn: (id: number) => apiClient.delete(`/exchange-rates/${id}/`),
    onSuccess: () => {
      notifications.show({
        color: "green",
        message: t("Exchange rate deleted"),
      });
      queryClient.invalidateQueries({ queryKey: ["exchange-rates"] });
    },
    onError: () => {
      notifications.show({
        color: "red",
        message: t("Unable to delete exchange rate"),
      });
    },
  });
};

export const useUpdateExchangeRate = (props?: MutateProps) => {
  const { t } = useTranslation();

  return useMutation({
    mutationFn: ({ id, newExchangeRate }: UpdateMutationProps) =>
      apiClient.put(`/exchange-rates/${id}/`, newExchangeRate),
    onSuccess: () => {
      props?.onSuccess?.();
      notifications.show({
        color: "green",
        message: t("ExchangeRate has been updated"),
      });
      queryClient.invalidateQueries({ queryKey: ["exchange-rates"] });
    },
    onError: () => {
      props?.onError?.();
      notifications.show({
        color: "red",
        message: t("Unable to update exchange rate"),
      });
    },
  });
};
