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
  deleteById:(marketId: number) => void;
  deleteSuperSectorById:(id: number) => void;
  update: (id: number, newValues: ISectorFormFields) => void;
  updateSuperSector: (id: number, newValues: ISectorFormFields) => void;
};

export const sectorsDefaultValue: SectorsContextType = {
  isLoading: false,
  sectors: [],
  superSectors: [],
  sector: null,
  superSector: null,
  create: (newValues: ISectorFormFields) => undefined,
  createSuperSector: (newValues: ISectorFormFields) => undefined,
  getAll: () => [],
  getAllSuperSectors: () => [],
  getById: (id: number) => undefined,
  getSuperSectorById: (id: number) => undefined,
  deleteById: (id: number) => undefined,
  deleteSuperSectorById: (id: number) => undefined,
  update: (id: number, newValues: ISectorFormFields) => undefined,
  updateSuperSector: (id: number, newValues: ISectorFormFields) => undefined
};

export const SectorsContext =
  createContext<SectorsContextType>(sectorsDefaultValue);
