import { useTranslation } from "react-i18next";
import { notifications } from "@mantine/notifications";
import { keepPreviousData, useMutation, useQuery } from "@tanstack/react-query";
import { MRT_PaginationState } from "mantine-react-table";
import { apiClient } from "api/api-client";
import queryClient from "api/query-client";
import { IMarket, IMarketFormFields, ITimezone } from "types/market";

interface UpdateMutationProps {
  newMarket: IMarketFormFields;
  id: number | undefined;
}

type MarketsApiResponse = {
  results: Array<IMarket>;
  count: number;
  next: number | null;
  previous: number | null;
};

interface Params {
  pagination?: MRT_PaginationState;
}

export const fetchMarkets = async (
  pagination: MRT_PaginationState | undefined,
) => {
  const fetchURL = new URL("markets/", apiClient.defaults.baseURL);
  if (pagination) {
    fetchURL.searchParams.set(
      "offset",
      `${pagination.pageIndex * pagination.pageSize}`,
    );
    fetchURL.searchParams.set("limit", `${pagination.pageSize}`);
  }
  const { data } = await apiClient.get<MarketsApiResponse>(fetchURL.href);
  return data;
};

export function useMarkets({ pagination = undefined }: Params) {
  return useQuery<MarketsApiResponse, Error>({
    queryKey: ["markets", pagination],
    queryFn: () => fetchMarkets(pagination),
    placeholderData: keepPreviousData, // useful for paginated queries by keeping data from previous pages on screen while fetching the next page
    staleTime: 30_000, // don't refetch previously viewed pages until cache is more than 30 seconds old
  });
}

export const fetchAllMarkets = async () => {
  const fetchURL = new URL("/api/v1/markets/", apiClient.defaults.baseURL);
  const { data } = await apiClient.get<IMarket[]>(fetchURL.href);
  return data;
};

export function useAllMarkets() {
  return useQuery<IMarket[], Error>({
    queryKey: ["markets"],
    queryFn: () => fetchAllMarkets(),
    placeholderData: keepPreviousData, // useful for paginated queries by keeping data from previous pages on screen while fetching the next page
    staleTime: 30_000, // don't refetch previously viewed pages until cache is more than 30 seconds old
  });
}

export const fetchMarket = async (marketId: number | undefined) => {
  if (!marketId) {
    throw new Error("marketId is required");
  }
  const fetchURL = new URL(`markets/${marketId}/`, apiClient.defaults.baseURL);

  const { data } = await apiClient.get<IMarket>(fetchURL.href);
  return data;
};

export function useMarket(marketId: number | undefined, options?: any) {
  return useQuery<IMarket, Error>({
    queryKey: ["markets", marketId],
    queryFn: () => fetchMarket(marketId),
    enabled: !!marketId,
    ...options,
  });
}

interface MutateProps {
  onSuccess?: Function;
  onError?: Function;
}

export const useAddMarket = (props?: MutateProps) => {
  const { t } = useTranslation();

  return useMutation({
    mutationFn: (newMarket: IMarketFormFields) =>
      apiClient.post(`/markets/`, newMarket),
    onSuccess: () => {
      props?.onSuccess?.();
      notifications.show({
        color: "green",
        message: t("Market created"),
      });
      queryClient.invalidateQueries({ queryKey: ["markets"] });
    },
    onError: () => {
      props?.onError?.();
      notifications.show({
        color: "red",
        message: t("Unable to create market"),
      });
    },
  });
};

export const useDeleteMarket = () => {
  const { t } = useTranslation();

  return useMutation({
    mutationFn: (id: number) => apiClient.delete(`/markets/${id}/`),
    onSuccess: () => {
      notifications.show({
        color: "green",
        message: t("Market deleted"),
      });
      queryClient.invalidateQueries({ queryKey: ["markets"] });
    },
    onError: () => {
      notifications.show({
        color: "red",
        message: t("Unable to delete market"),
      });
    },
  });
};

export const useUpdateMarket = (props?: MutateProps) => {
  const { t } = useTranslation();

  return useMutation({
    mutationFn: ({ id, newMarket }: UpdateMutationProps) =>
      apiClient.put(`/markets/${id}/`, newMarket),
    onSuccess: () => {
      props?.onSuccess?.();
      notifications.show({
        color: "green",
        message: t("Market has been updated"),
      });
      queryClient.invalidateQueries({ queryKey: ["markets"] });
    },
    onError: () => {
      props?.onSuccess?.();
      notifications.show({
        color: "red",
        message: t("Unable to update market"),
      });
    },
  });
};

export const useInitializeMarkets = () => {
  const { t } = useTranslation();

  return useMutation({
    mutationFn: () => apiClient.post<IMarket[]>(`/initialize-data/markets/`),

    onSuccess: () => {
      notifications.show({
        color: "green",
        message: t("Markets created"),
      });
      queryClient.invalidateQueries({ queryKey: ["markets"] });
    },
    onError: () => {
      notifications.show({
        color: "red",
        message: t("Unable to create markets"),
      });
    },
  });
};

export const fetchTimezones = async () => {
  const { data } = await apiClient.get<IMarket[]>("/timezones/");
  return data;
};

export function useTimezones() {
  return useQuery<ITimezone[], Error>({
    queryKey: ["timezones"],
    queryFn: fetchTimezones,
  });
}

export default useMarkets;
