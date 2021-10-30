import { createContext } from "react";
import { ISector, ISectorFormFields } from "types/sector";

export type SectorsContextType = {
  isLoading: boolean;
  sectors: ISector[] | [];
  sector: ISector | null;
  create: (newValues: ISectorFormFields) => void;
  getAll: () => void;
  getById: (marketId: number) => void;
  deleteById:(marketId: number) => void;
  update: (marketId: number, newValues: ISectorFormFields) => void;
};

export const sectorsDefaultValue: SectorsContextType = {
  isLoading: false,
  sectors: [],
  sector: null,
  create: (newValues: ISectorFormFields) => undefined,
  getAll: () => [],
  getById: (marketId: number) => undefined,
  deleteById: (id: number) => undefined,
  update: (settingsId: number, newValues: ISectorFormFields) => undefined
};

export const SectorsContext =
  createContext<SectorsContextType>(sectorsDefaultValue);
