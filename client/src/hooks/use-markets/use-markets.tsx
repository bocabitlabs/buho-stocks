import { useTranslation } from "react-i18next";
import { useMutation, useQuery } from "react-query";
import { toast } from "react-toastify";
import { apiClient } from "api/api-client";
import queryClient from "api/query-client";
import { IMarket, IMarketFormFields, ITimezone } from "types/market";

interface UpdateMutationProps {
  newMarket: IMarketFormFields;
  id: number | undefined;
}

export const fetchMarkets = async () => {
  const { data } = await apiClient.get<IMarket[]>("/markets/");
  return data;
};

export const fetchMarket = async (marketId: number | undefined) => {
  if (!marketId) {
    throw new Error("marketId is required");
  }
  const { data } = await apiClient.get<IMarket>(`/markets/${marketId}/`);
  return data;
};

export function useMarkets() {
  return useQuery<IMarket[], Error>("markets", fetchMarkets);
}

export function useMarket(marketId: number | undefined, options?: any) {
  return useQuery<IMarket, Error>(
    ["markets", marketId],
    () => fetchMarket(marketId),
    {
      enabled: !!marketId,
      ...options,
    },
  );
}

export const useAddMarket = () => {
  const { t } = useTranslation();

  return useMutation(
    (newMarket: IMarketFormFields) => apiClient.post(`/markets/`, newMarket),
    {
      onSuccess: () => {
        toast.success(t("Market created"));
        queryClient.invalidateQueries(["markets"]);
      },
      onError: () => {
        toast.error(t("Unable to create market"));
        queryClient.invalidateQueries(["markets"]);
      },
    },
  );
};

export const useDeleteMarket = () => {
  const { t } = useTranslation();

  return useMutation((id: number) => apiClient.delete(`/markets/${id}/`), {
    onSuccess: () => {
      toast.success(t("Market deleted"));
      queryClient.invalidateQueries(["markets"]);
    },
    onError: () => {
      toast.error(t("Unable to delete market"));
      queryClient.invalidateQueries(["markets"]);
    },
  });
};

export const useUpdateMarket = () => {
  const { t } = useTranslation();

  return useMutation(
    ({ id, newMarket }: UpdateMutationProps) =>
      apiClient.put(`/markets/${id}/`, newMarket),
    {
      onSuccess: () => {
        toast.success(t("Market has been updated"));
        queryClient.invalidateQueries(["markets"]);
      },
      onError: () => {
        toast.error(t("Unable to update market"));
        queryClient.invalidateQueries(["markets"]);
      },
    },
  );
};

export const useInitializeMarkets = () => {
  const { t } = useTranslation();

  return useMutation(
    () => apiClient.post<IMarket[]>(`/initialize-data/markets/`),
    {
      onSuccess: () => {
        toast.success(t("Markets created"));
        queryClient.invalidateQueries(["markets"]);
      },
      onError: () => {
        toast.error(t("Unable to create markets"));
        queryClient.invalidateQueries(["markets"]);
      },
    },
  );
};

export const fetchTimezones = async () => {
  const { data } = await apiClient.get<IMarket[]>("/timezones/");
  return data;
};

export function useTimezones() {
  return useQuery<ITimezone[], Error>("timezones", fetchTimezones);
}

export default useMarkets;
