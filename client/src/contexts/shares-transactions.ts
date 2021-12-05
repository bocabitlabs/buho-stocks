import { createContext } from "react";
import {
  ISharesTransaction,
  ISharesTransactionFormFields
} from "types/shares-transaction";

export type SharesTransactionsContextType = {
  isLoading: boolean;
  transactions: ISharesTransaction[] | [];
  transaction: ISharesTransaction | null;
  create: (newValues: ISharesTransactionFormFields) => void;
  getAll: () => void;
  getById: (id: number) => void;
  deleteById: (id: number) => void;
  update: (id: number, newValues: ISharesTransactionFormFields) => void;
};

export const defaultValue: SharesTransactionsContextType = {
  isLoading: false,
  transactions: [],
  transaction: null,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  create: (newValues: ISharesTransactionFormFields) => undefined,
  getAll: () => [],
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  getById: (marketId: number) => undefined,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  deleteById: (id: number) => undefined,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  update: (id: number, newValues: ISharesTransactionFormFields) => undefined
};

export const SharesTransactionsContext =
  createContext<SharesTransactionsContextType>(defaultValue);
