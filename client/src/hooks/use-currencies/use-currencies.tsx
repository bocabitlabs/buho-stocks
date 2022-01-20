import { useQuery } from "react-query";
import axios from "axios";
import { getAxiosOptionsWithAuth } from "api/api-client";
import { ICurrency } from "types/currency";

export const fetchCurrencies = async () => {
  const { data } = await axios.get<ICurrency[]>(
    "/api/v1/currencies/",
    getAxiosOptionsWithAuth(),
  );
  return data;
};
export function useCurrencies() {
  return useQuery<ICurrency[], Error>("currencies", fetchCurrencies);
}
