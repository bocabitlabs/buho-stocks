import { createContext } from "react";
import { IMarket, IMarketFormFields } from "types/market";

export type MarketsContextType = {
  isLoading: boolean;
  markets: IMarket[] | [];
  market: IMarket | null;
  create: (newValues: IMarketFormFields) => void;
  getAll: () => void;
  getById: (marketId: number) => void;
  deleteById:(marketId: number) => void;
  update: (marketId: number, newValues: IMarketFormFields) => void;
};

export const marketsDefaultValue: MarketsContextType = {
  isLoading: false,
  markets: [],
  market: null,
  create: (newValues: IMarketFormFields) => undefined,
  getAll: () => [],
  getById: (marketId: number) => undefined,
  deleteById: (id: number) => undefined,
  update: (settingsId: number, newValues: IMarketFormFields) => undefined
};

export const MarketsContext =
  createContext<MarketsContextType>(marketsDefaultValue);
