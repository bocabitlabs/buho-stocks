import { useQuery } from "react-query";
import { apiClient } from "api/api-client";

export const fetchIndexes = async () => {
  const { data } = await apiClient.get(`/stock-markets-indexes/`);
  return data;
};

export function useStockMarketIndexes(otherOptions?: any) {
  return useQuery(["indexes"], () => fetchIndexes(), {
    ...otherOptions,
  });
}

export const fetchIndexValues = async (id: number | undefined) => {
  const { data } = await apiClient.get(`/stock-markets-indexes/${id}/`);
  return data;
};

export function useStockMarketIndexValues(
  id: number | undefined,
  otherOptions?: any,
) {
  return useQuery(["indexes", id], () => fetchIndexValues(id), {
    enabled: id !== undefined,
    ...otherOptions,
  });
}
