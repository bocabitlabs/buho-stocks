import { createContext } from "react";
import { ISettings, ISettingsFormFields } from "types/settings";

export type SettingsContextType = {
  isLoading: boolean;
  settings: ISettings | null;
  get: () => void;
  update: (settingsId: number, newValues: ISettingsFormFields) => void;
};

export const settingsDefaultValue: SettingsContextType = {
  isLoading: false,
  settings: null,
  get: () => null,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  update: (settingsId: number, newValues: ISettingsFormFields) => undefined,
};

export const SettingsContext =
  createContext<SettingsContextType>(settingsDefaultValue);
