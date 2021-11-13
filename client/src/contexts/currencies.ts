import { createContext } from "react";
import { ICurrency, ICurrencyFormFields } from "types/currency";

export type CurrenciesContextType = {
  isLoading: boolean;
  currencies: ICurrency[] | [];
  currency: ICurrency | null;
  create: (newValues: ICurrencyFormFields) => void;
  getAll: () => void;
  getById: (currencyId: number) => void;
  deleteById: (currencyId: number) => void;
  update: (currencyId: number, newValues: ICurrencyFormFields) => void;
};

export const currenciesDefaultValue: CurrenciesContextType = {
  isLoading: false,
  currencies: [],
  currency: null,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  create: (newValues: ICurrencyFormFields) => undefined,
  getAll: () => [],
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  getById: (currencyId: number) => undefined,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  deleteById: (id: number) => undefined,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  update: (settingsId: number, newValues: ICurrencyFormFields) => undefined
};

export const CurrenciesContext = createContext<CurrenciesContextType>(
  currenciesDefaultValue
);
