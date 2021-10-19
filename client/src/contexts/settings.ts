import { IApiResponse } from "api/api-client";
import { createContext } from "react";
import { ISettings, ISettingsFormFields } from "types/settings";


export type SettingsContextType = {
  isLoading: boolean;
  settings: ISettings | null;
  get: () => ISettings|null;
  update: (newValue: ISettingsFormFields) => Promise<IApiResponse>| undefined;
};

export const settingsDefaultValue: SettingsContextType = {
  isLoading: false,
  settings: null,
  get: () => null,
  update: (newValue: ISettingsFormFields) => undefined
};

export const SettingsContext = createContext<SettingsContextType>(
  settingsDefaultValue
);