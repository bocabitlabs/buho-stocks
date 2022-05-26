import { useTranslation } from "react-i18next";
import { useMutation, useQuery } from "react-query";
import { toast } from "react-toastify";
import { apiClient } from "api/api-client";
import queryClient from "api/query-client";
import { IMarket, IMarketFormFields, ITimezone } from "types/market";

interface UpdateMarketMutationProps {
  newMarket: IMarketFormFields;
  marketId: number;
}

export const fetchMarkets = async () => {
  const { data } = await apiClient.get<IMarket[]>("/markets/");
  return data;
};

export const fetchTimezones = async () => {
  const { data } = await apiClient.get<IMarket[]>("/markets/timezones/");
  return data;
};

export const fetchMarket = async (marketId: number | undefined) => {
  if (!marketId) {
    throw new Error("marketId is required");
  }
  const { data } = await apiClient.get<IMarket>(`/markets/${marketId}/`);
  return data;
};

export const useAddMarket = (options?: any) => {
  const { t } = useTranslation();

  return useMutation(
    (newMarket: IMarketFormFields) => apiClient.post("/markets/", newMarket),
    {
      onSuccess: () => {
        toast.success(t("Market created"));
        queryClient.invalidateQueries("markets");
      },
      onError: (error: any) => {
        toast.error(t(`Cannot create market: ${error}`));
      },
      ...options,
    },
  );
};

export const useDeleteMarket = () => {
  return useMutation((id: number) => apiClient.delete(`/markets/${id}/`), {
    onSuccess: () => {
      queryClient.invalidateQueries(["markets"]);
    },
  });
};

export const useUpdateMarket = (options?: any) => {
  const { t } = useTranslation();

  return useMutation(
    ({ marketId, newMarket }: UpdateMarketMutationProps) =>
      apiClient.put(`/markets/${marketId}/`, newMarket),
    {
      onSuccess: () => {
        toast.success(t("Market has been updated"));
        queryClient.invalidateQueries(["markets"]);
      },
      onError: (error: any) => {
        toast.error(t(`Cannot update market: ${error}`));
      },
      ...options,
    },
  );
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

export function useTimezones() {
  return useQuery<ITimezone[], Error>("timezones", fetchTimezones);
}

export default useMarkets;
