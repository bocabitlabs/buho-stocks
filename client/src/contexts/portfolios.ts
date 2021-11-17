import { createContext } from "react";
import { IPortfolio, IPortfolioFormFields } from "types/portfolio";

export type PortfoliosContextType = {
  isLoading: boolean;
  portfolios: IPortfolio[] | [];
  portfolio: IPortfolio | null;
  create: (newValues: IPortfolioFormFields) => void;
  getAll: () => void;
  getById: (id: number) => void;
  deleteById: (id: number) => void;
  update: (id: number, newValues: IPortfolioFormFields) => void;
};

export const portfoliosDefaultValue: PortfoliosContextType = {
  isLoading: false,
  portfolios: [],
  portfolio: null,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  create: (newValues: IPortfolioFormFields) => undefined,
  getAll: () => [],
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  getById: (marketId: number) => undefined,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  deleteById: (id: number) => undefined,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  update: (id: number, newValues: IPortfolioFormFields) => undefined
};

export const PortfoliosContext = createContext<PortfoliosContextType>(
  portfoliosDefaultValue
);
