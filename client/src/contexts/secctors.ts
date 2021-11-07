import { createContext } from "react";
import { ISector, ISectorFormFields } from "types/sector";

export type SectorsContextType = {
  isLoading: boolean;
  sectors: ISector[] | [];
  superSectors: ISector[] | [];
  sector: ISector | null;
  superSector: ISector | null;
  create: (newValues: ISectorFormFields) => void;
  createSuperSector: (newValues: ISectorFormFields) => void;
  getAll: () => void;
  getAllSuperSectors: () => void;
  getById: (id: number) => void;
  getSuperSectorById: (id: number) => void;
  deleteById: (marketId: number) => void;
  deleteSuperSectorById: (id: number) => void;
  update: (id: number, newValues: ISectorFormFields) => void;
  updateSuperSector: (id: number, newValues: ISectorFormFields) => void;
};

export const sectorsDefaultValue: SectorsContextType = {
  isLoading: false,
  sectors: [],
  superSectors: [],
  sector: null,
  superSector: null,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  create: (newValues: ISectorFormFields) => undefined,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  createSuperSector: (newValues: ISectorFormFields) => undefined,
  getAll: () => [],
  getAllSuperSectors: () => [],
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  getById: (id: number) => undefined,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  getSuperSectorById: (id: number) => undefined,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  deleteById: (id: number) => undefined,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  deleteSuperSectorById: (id: number) => undefined,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  update: (id: number, newValues: ISectorFormFields) => undefined,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  updateSuperSector: (id: number, newValues: ISectorFormFields) => undefined
};

export const SectorsContext =
  createContext<SectorsContextType>(sectorsDefaultValue);
