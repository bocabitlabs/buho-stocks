import { createContext } from "react";
import { IMarket, IMarketFormFields } from "types/market";

export type MarketsContextType = {
  isLoading: boolean;
  markets: IMarket[] | [];
  market: IMarket | null;
  create: (newValues: IMarketFormFields) => Promise<any>;
  getAll: () => Promise<any>;
  getById: (marketId: number) => Promise<any>;
  deleteById: (marketId: number) => Promise<any>;
  update: (marketId: number, newValues: IMarketFormFields) => Promise<any>;
};

export const marketsDefaultValue: MarketsContextType = {
  isLoading: false,
  markets: [],
  market: null,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  create: (newValues: IMarketFormFields) => Promise.resolve(),
  getAll: () => Promise.resolve(),
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  getById: (marketId: number) => Promise.resolve(),
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  deleteById: (id: number) => Promise.resolve(),
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  update: (settingsId: number, newValues: IMarketFormFields) =>
    Promise.resolve(),
};

export const MarketsContext =
  createContext<MarketsContextType>(marketsDefaultValue);
