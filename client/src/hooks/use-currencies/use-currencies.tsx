import { useQuery } from "react-query";
import axios from "axios";
import { axiosOptionsWithAuth } from "api/api-client";

export const fetchCurrencies = async () => {
  const { data } = await axios.get("/api/v1/currencies/", axiosOptionsWithAuth);
  return data;
};

export function useCurrencies() {
  return useQuery("currencies", fetchCurrencies);
}

export default useCurrencies;
