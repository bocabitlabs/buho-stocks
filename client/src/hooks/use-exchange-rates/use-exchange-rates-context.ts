import { useCallback, useState } from "react";
import useFetch from "use-http";
import { ExchangeRatesContextType } from "contexts/exchange-rates";
import { IExchangeRate } from "types/exchange-rate";

export function useExchangeRatesContext(): ExchangeRatesContextType {
  const [exchangeRate, setExchangeRate] = useState<IExchangeRate | null>(null);
  const endpoint = `/api/v1/exchange-rates/`;
  const getHeaders = useCallback(() => {
    const headers = {
      Accept: "application/json",
      Authorization: `Token ${localStorage.getItem("token")}`,
    };
    return headers;
  }, []);
  const {
    get: getRequest,
    response,
    error,
    loading: isLoading,
  } = useFetch(endpoint, {
    headers: getHeaders(),
  });

  const get = useCallback(
    async (fromCode: string, toCode: string, echangeDate: string) => {
      const responseValues = await getRequest(
        `${fromCode}/${toCode}/${echangeDate}/`,
      );
      if (response.ok) {
        setExchangeRate(responseValues);
      } else {
        console.error(error);
      }

      return response;
    },
    [getRequest, setExchangeRate, error, response],
  );

  return {
    isLoading,
    exchangeRate,
    get,
  };
}

export default useExchangeRatesContext;
