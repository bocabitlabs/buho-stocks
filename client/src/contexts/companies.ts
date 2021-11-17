import { createContext } from "react";
import { ICompany, ICompanyFormFields } from "types/company";

export type CompaniesContextType = {
  isLoading: boolean;
  companies: ICompany[] | [];
  company: ICompany | null;
  create: (newValues: ICompanyFormFields) => void;
  getAll: () => void;
  getById: (id: number) => void;
  deleteById: (id: number) => void;
  update: (id: number, newValues: ICompanyFormFields) => void;
};

export const defaultValue: CompaniesContextType = {
  isLoading: false,
  companies: [],
  company: null,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  create: (newValues: ICompanyFormFields) => undefined,
  getAll: () => [],
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  getById: (marketId: number) => undefined,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  deleteById: (id: number) => undefined,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  update: (id: number, newValues: ICompanyFormFields) => undefined
};

export const CompaniesContext =
  createContext<CompaniesContextType>(defaultValue);
