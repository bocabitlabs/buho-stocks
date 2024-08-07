import React, { createContext, useMemo } from "react";
import { MRT_Localization } from "mantine-react-table";
import { MRT_Localization_EN } from "mantine-react-table/locales/en/index.esm.mjs";
import { MRT_Localization_ES } from "mantine-react-table/locales/es/index.esm.mjs";
import { useSettings } from "hooks/use-settings/use-settings";

type Props = {
  children: React.ReactNode;
};

export const LanguageContext = createContext<MRT_Localization | undefined>(
  undefined,
);

export function LanguageProvider({ children }: Props) {
  const { data: settings } = useSettings();

  const localization = useMemo(() => {
    if (!settings) {
      return undefined;
    }
    if (settings.language === "en") {
      return MRT_Localization_EN;
    }
    if (settings.language === "es") {
      return MRT_Localization_ES;
    }
    return undefined; // default language
  }, [settings]);

  return (
    <LanguageContext.Provider value={localization}>
      {children}
    </LanguageContext.Provider>
  );
}
