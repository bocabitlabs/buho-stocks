import { useCallback, useContext, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { message } from "antd";
import { AuthContext } from "contexts/auth";
import { SettingsContextType } from "contexts/settings";
import { useApi } from "hooks/use-api/use-api-hook";
import { ISettings, ISettingsFormFields } from "types/settings";

export function useSettingsContext(): SettingsContextType {
  const [settings, setSettings] = useState<ISettings | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { t } = useTranslation();
  const { get: apiGet, put: updateSettings } = useApi();
  const endpoint = "/api/v1/settings/";
  const { state: authState } = useContext(AuthContext);

  const get = useCallback(async () => {
    setIsLoading(true);
    const result = await apiGet(endpoint);
    console.log(result);
    setSettings(result);
    setIsLoading(false);
  }, [apiGet]);

  const update = async (settingsId: number, newValues: ISettingsFormFields) => {
    const response = await updateSettings(endpoint, { settingsId, newValues });

    if (response?.error) {
      message.error({
        content: t(`Error ${response.statusCode}: Unable to update settings`)
      });
    } else {
      message.success({ content: t("Settings have been updated") });
    }
  };

  useEffect(() => {
    if (authState.isAuthenticated) {
      get();
      console.log("user is authenticated. Should get settings");
    } else {
      console.log("User is not logged in. No getting settings");
    }
  }, [get]);
  return {
    isLoading,
    settings,
    get,
    update
  };
}

export default useSettingsContext;
