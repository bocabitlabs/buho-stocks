import { message } from "antd";
import { SettingsContextType } from "contexts/settings";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import SettingsService from "services/settings/settings-service";
import { ISettings, ISettingsFormFields } from "types/settings";

export function useSettingsContext(): SettingsContextType {
  const [settings, setSettings] = useState<ISettings | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { t } = useTranslation();

  useEffect(() => {
    get();
  }, []);

  const get = async () => {
    setIsLoading(true);
    const response = await new SettingsService().getSettings();
    if (response.error) {
      return response;
    }
    setSettings(response.result);
    setIsLoading(false);
  };

  const update = async (settingsId: number, newValues: ISettingsFormFields) => {
    // const response = await client.updateSettings(settingsId, data);
    const response = await new SettingsService().updateSettings(
      settingsId,
      newValues
    );

    if (response?.error) {
      message.error({
        content: t(`Error ${response.statusCode}: Unable to update settings`)
      });
    } else {
      message.success({ content: t("Settings have been updated") });
    }
  };

  return {
    isLoading,
    settings,
    get,
    update
  };
}
