import { ReactNode, useContext, useEffect, useRef } from "react";
import { AuthContext } from "contexts/auth";
import { SettingsContext } from "contexts/settings";
import i18n from "i18n";

interface Props {
  children: ReactNode;
}

function SettingsLoader({ children }: Props) {
  const { settings, get: getSettings } = useContext(SettingsContext);
  const { state: authState } = useContext(AuthContext);
  const cancelRequest = useRef<boolean>(false);

  useEffect(() => {
    if (cancelRequest.current) return undefined;

    console.debug("Loading default language");
    i18n.changeLanguage(settings?.language);
    return () => {
      console.log("Cancelling request");
      cancelRequest.current = true;
    };
  }, [settings]);

  useEffect(() => {
    if (cancelRequest.current) return undefined;

    if (authState.isAuthenticated) {
      console.debug("Loading app settings");
      getSettings();
    }
    return () => {
      console.log("Cancelling request");
      cancelRequest.current = true;
    };
  }, [getSettings, authState.isAuthenticated]);

  return children;
}

export default SettingsLoader;
