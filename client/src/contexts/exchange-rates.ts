import { createContext } from "react";
import { IExchangeRate } from "types/exchange-rate";

export type ExchangeRatesContextType = {
  isLoading: boolean;
  exchangeRate: IExchangeRate | null;
  get: (
    fromCode: string,
    toCode: string,
    exchangeDate: string,
  ) => Promise<any> | undefined;
};

export const defaultValue: ExchangeRatesContextType = {
  isLoading: false,
  exchangeRate: null,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  get: (fromCode: string, toCode: string, exchangeDate: string) => undefined,
};

export const ExchangeRatesContext =
  createContext<ExchangeRatesContextType>(defaultValue);
