import { SettingsContextType } from "contexts/settings";
import { useEffect, useState } from "react";
import SettingsService from "services/settings/settings-service";
import { ISettings, ISettingsFormFields } from "types/settings";

export function useSettingsContext(): SettingsContextType {
  const [settings, setSettings] = useState<ISettings | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    get();
  }, []);

  const get = async () => {
    setIsLoading(true);
    const response = await SettingsService.getSettings();
    if (response.error) {
      return response;
    }
    setSettings(response.result);
    setIsLoading(false);
  };

  const update = async (settingsId: number, newValues: ISettingsFormFields) => {
    const data = {
      "company_display_mode": newValues.companyDisplayMode,
      "company_sort_by": newValues.companySortBy,
      "language": newValues.language,
      "main_portfolio": newValues.mainPortfolio,
      "portfolio_sort_by": newValues.portfolioSortBy,
      "portfolio_display_mode": newValues.portfolioDisplayMode
    }
    // const response = await client.updateSettings(settingsId, data);
    await SettingsService.updateSettings(settingsId, data);

    // if (response.error) {
    //   return response.result;
    // }
  };

  return {
    isLoading,
    settings,
    get,
    update
  };
}
