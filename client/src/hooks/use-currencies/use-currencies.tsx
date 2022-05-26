import { useQuery } from "react-query";
import { apiClient } from "api/api-client";
import { ICurrency } from "types/currency";

export const fetchCurrencies = async () => {
  const { data } = await apiClient.get<ICurrency[]>("/currencies/");
  return data;
};
export function useCurrencies() {
  return useQuery<ICurrency[], Error>("currencies", fetchCurrencies);
}
