import { createContext } from "react";
import {
  IDividendsTransaction,
  IDividendsTransactionFormFields
} from "types/dividends-transaction";

export type DividendsTransactionsContextType = {
  isLoading: boolean;
  transactions: IDividendsTransaction[] | [];
  transaction: IDividendsTransaction | null;
  create: (newValues: IDividendsTransactionFormFields) => void;
  getAll: () => void;
  getById: (id: number) => void;
  deleteById: (id: number) => void;
  update: (id: number, newValues: IDividendsTransactionFormFields) => void;
};

export const defaultValue: DividendsTransactionsContextType = {
  isLoading: false,
  transactions: [],
  transaction: null,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  create: (newValues: IDividendsTransactionFormFields) => undefined,
  getAll: () => [],
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  getById: (marketId: number) => undefined,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  deleteById: (id: number) => undefined,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  update: (id: number, newValues: IDividendsTransactionFormFields) => undefined
};

export const DividendsTransactionsContext =
  createContext<DividendsTransactionsContextType>(defaultValue);
