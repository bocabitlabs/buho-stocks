import { useTranslation } from "react-i18next";
import { notifications } from "@mantine/notifications";
import { keepPreviousData, useMutation, useQuery } from "@tanstack/react-query";
import { MRT_PaginationState } from "mantine-react-table";
import { apiClient } from "api/api-client";
import queryClient from "api/query-client";
import { ICurrency, ICurrencyFormFields } from "types/currency";

interface UpdateMutationProps {
  newCurrency: ICurrencyFormFields;
  id: number | undefined;
}

type CurrenciesApiResponse = {
  results: Array<ICurrency>;
  count: number;
  next: number | null;
  previous: number | null;
};

interface Params {
  pagination?: MRT_PaginationState;
}

export const fetchCurrencies = async (
  pagination: MRT_PaginationState | undefined,
) => {
  const fetchURL = new URL("/api/v1/currencies/", apiClient.defaults.baseURL);
  if (pagination) {
    fetchURL.searchParams.set(
      "offset",
      `${pagination.pageIndex * pagination.pageSize}`,
    );
    fetchURL.searchParams.set("limit", `${pagination.pageSize}`);
  }
  const { data } = await apiClient.get<CurrenciesApiResponse>(fetchURL.href);
  return data;
};
export function useCurrencies({ pagination = undefined }: Params) {
  return useQuery<CurrenciesApiResponse, Error>({
    queryKey: ["currencies", pagination],
    queryFn: () => fetchCurrencies(pagination),
    placeholderData: keepPreviousData, // useful for paginated queries by keeping data from previous pages on screen while fetching the next page
    staleTime: 30_000, // don't refetch previously viewed pages until cache is more than 30 seconds old
  });
}

export const fetchAllCurrencies = async () => {
  const { data } = await apiClient.get<ICurrency[]>("/currencies/");
  return data;
};
export function useAllCurrencies() {
  return useQuery<ICurrency[], Error>({
    queryKey: ["currencies"],
    queryFn: fetchAllCurrencies,
  });
}

export const fetchCurrency = async (id: number | undefined) => {
  if (!id) {
    throw new Error("Id is required");
  }
  const { data } = await apiClient.get<ICurrency>(`/currencies/${id}/`);
  return data;
};

export function useCurrency(id: number | undefined, options?: any) {
  return useQuery<ICurrency, Error>({
    queryKey: ["currencies", id],
    queryFn: () => fetchCurrency(id),
    enabled: !!id,
    ...options,
  });
}

interface MutateProps {
  onSuccess?: Function;
  onError?: Function;
}

export const useAddCurrency = (props?: MutateProps) => {
  const { t } = useTranslation();

  return useMutation({
    mutationFn: (newCurrency: ICurrencyFormFields) =>
      apiClient.post(`/currencies/`, newCurrency),
    onSuccess: () => {
      props?.onSuccess?.();
      notifications.show({
        color: "green",
        message: t("Currency created"),
      });
      queryClient.invalidateQueries({ queryKey: ["currencies"] });
    },
    onError: () => {
      props?.onError?.();
      notifications.show({
        color: "red",
        message: t("Unable to create currency"),
      });
    },
  });
};

export const useDeleteCurrency = () => {
  const { t } = useTranslation();

  return useMutation({
    mutationFn: (id: number) => apiClient.delete(`/currencies/${id}/`),
    onSuccess: () => {
      notifications.show({
        color: "green",
        message: t("Currency deleted"),
      });
      queryClient.invalidateQueries({ queryKey: ["currencies"] });
    },
    onError: () => {
      notifications.show({
        color: "red",
        message: t("Unable to delete currency"),
      });
    },
  });
};

export const useUpdateCurrency = (props?: MutateProps) => {
  const { t } = useTranslation();

  return useMutation({
    mutationFn: ({ id, newCurrency }: UpdateMutationProps) =>
      apiClient.put(`/currencies/${id}/`, newCurrency),
    onSuccess: () => {
      props?.onSuccess?.();

      notifications.show({
        color: "green",
        message: t("Currency has been updated"),
      });
      queryClient.invalidateQueries({ queryKey: ["currencies"] });
    },
    onError: () => {
      props?.onError?.();
    },
  });
};

export const useInitializeCurrencies = () => {
  const { t } = useTranslation();

  return useMutation({
    mutationFn: () =>
      apiClient.post<ICurrency[]>(`/initialize-data/currencies/`),
    onSuccess: () => {
      notifications.show({
        color: "green",
        message: t("Currencies created"),
      });
      queryClient.invalidateQueries({ queryKey: ["currencies"] });
    },
    onError: () => {
      notifications.show({
        color: "red",
        message: t("Unable to create currencies"),
      });
    },
  });
};
