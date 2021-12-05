import React, { FC, ReactNode, useContext, useEffect } from "react";
import { AuthContext } from "contexts/auth";
import { SettingsContext } from "contexts/settings";
import i18n from "i18n";

const SettingsLoader: FC<ReactNode> = ({ children }) => {
  const { settings, get: getSettings } = useContext(SettingsContext);
  const { state: authState } = useContext(AuthContext);

  useEffect(() => {
    console.debug("Loading default language");
    i18n.changeLanguage(settings?.language);
  }, [settings]);

  useEffect(() => {
    if (authState.isAuthenticated) {
      console.debug("Loading app settings");
      getSettings();
    }
  }, []);

  return <>{children}</>;
};

export default SettingsLoader;
