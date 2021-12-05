import { useCallback, useState } from "react";
import { message } from "antd";
import { ExchangeRatesContextType } from "contexts/exchange-rates";
import { useApi } from "hooks/use-api/use-api-hook";
import { IExchangeRate } from "types/exchange-rate";

export function useExchangeRatesContext(): ExchangeRatesContextType {
  const [exchangeRate, setExchangeRate] = useState<IExchangeRate | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { get: apiGet } = useApi();
  const endpoint = `/api/v1/exchange-rates/`;

  const get = useCallback(
    async (fromCode: string, toCode: string, echangeDate: string) => {
      setIsLoading(true);
      try {
        const response = await apiGet(
          `${endpoint}${fromCode}/${toCode}/${echangeDate}/`
        );
        if (response?.error) {
          console.error(response);
        } else {
          setExchangeRate(response);
        }
      } catch (e) {
        console.error(e);
        message.error("Unable to fetch the exchange dates");
      } finally {
        setIsLoading(false);
      }
    },
    [apiGet, endpoint]
  );

  return {
    isLoading,
    exchangeRate,
    get
  };
}

export default useExchangeRatesContext;
