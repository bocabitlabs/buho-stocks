import { useQuery } from "react-query";
import { apiClient } from "api/api-client";
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
  console.log("Making exchange-rates call");
  const { data } = await apiClient.get<IExchangeRate>(
    `/exchange-rates/${fromCurrencyCode}/${toCurrencyCode}/${transactionDate}/`,
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
      useErrorBoundary: false,
    },
  );
}
