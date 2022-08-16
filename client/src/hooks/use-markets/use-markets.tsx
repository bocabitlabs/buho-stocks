import { useQuery } from "react-query";
import { apiClient } from "api/api-client";
import { IMarket, ITimezone } from "types/market";

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
