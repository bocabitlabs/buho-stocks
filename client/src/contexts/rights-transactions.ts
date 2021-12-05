import { createContext } from "react";
import {
  IRightsTransaction,
  IRightsTransactionFormFields
} from "types/rights-transaction";

export type RightsTransactionsContextType = {
  isLoading: boolean;
  transactions: IRightsTransaction[] | [];
  transaction: IRightsTransaction | null;
  create: (newValues: IRightsTransactionFormFields) => void;
  getAll: () => void;
  getById: (id: number) => void;
  deleteById: (id: number) => void;
  update: (id: number, newValues: IRightsTransactionFormFields) => void;
};

export const defaultValue: RightsTransactionsContextType = {
  isLoading: false,
  transactions: [],
  transaction: null,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  create: (newValues: IRightsTransactionFormFields) => undefined,
  getAll: () => [],
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  getById: (marketId: number) => undefined,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  deleteById: (id: number) => undefined,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  update: (id: number, newValues: IRightsTransactionFormFields) => undefined
};

export const RightsTransactionsContext =
  createContext<RightsTransactionsContextType>(defaultValue);
