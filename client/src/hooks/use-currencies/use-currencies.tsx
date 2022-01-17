import { useQuery } from "react-query";
import axios from "axios";
import { getAxiosOptionsWithAuth } from "api/api-client";

export const fetchCurrencies = async () => {
  const { data } = await axios.get(
    "/api/v1/currencies/",
    getAxiosOptionsWithAuth(),
  );
  return data;
};

export function useCurrencies() {
  return useQuery("currencies", fetchCurrencies);
}

export default useCurrencies;
