import React, { ReactNode, useEffect } from "react";
import useFetch from "use-http";
import i18n from "i18n";

interface Props {
  children: ReactNode;
}

function SettingsLoader({ children }: Props) {
  const { get: getSettings, response } = useFetch("settings");

  useEffect(() => {
    async function loadInitialSettings() {
      const initialData = await getSettings(`/`);
      if (response.ok) {
        i18n.changeLanguage(initialData?.language);
      }
    }
    loadInitialSettings();
  }, [response.ok, getSettings]);

  return <div>{children}</div>;
}

export default SettingsLoader;
