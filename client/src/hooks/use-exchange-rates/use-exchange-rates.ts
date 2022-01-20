import { useQuery } from "react-query";
import axios from "axios";
import { getAxiosOptionsWithAuth } from "api/api-client";
import { IExchangeRate } from "types/exchange-rate";

export const fetchExchangeRate = async (
  fromCurrencyCode: string | undefined,
  toCurrencyCode: string | undefined,
  transactionDate: string | undefined,
) => {
  if (!fromCurrencyCode || !toCurrencyCode || !transactionDate) {
    throw new Error(
      "fromCurrencyCode, toCurrencyCode and transactionDate are required",
    );
  }

  const { data } = await axios.get<IExchangeRate>(
    `/api/v1/exchange-rates/${fromCurrencyCode}/${toCurrencyCode}/${transactionDate}`,
    getAxiosOptionsWithAuth(),
  );
  return data;
};

export function useExchangeRate(
  fromCurrencyCode: string | undefined,
  toCurrencyCode: string | undefined,
  transactionDate: string | undefined,
) {
  return useQuery<IExchangeRate, Error>(
    ["exchange-rates", fromCurrencyCode, toCurrencyCode, transactionDate],
    () => fetchExchangeRate(fromCurrencyCode, toCurrencyCode, transactionDate),
    {
      enabled: false,
    },
  );
}
