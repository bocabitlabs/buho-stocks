import { useTranslation } from "react-i18next";
import { useMutation, useQuery } from "react-query";
import { toast } from "react-toastify";
import { apiClient } from "api/api-client";
import queryClient from "api/query-client";
import { ISettings, ISettingsFormFields } from "types/settings";

interface UpdateSettingsMutationProps {
  newSettings: ISettingsFormFields;
}

export const fetchSettings = async () => {
  const { data } = await apiClient.get<ISettings>("/settings/");
  return data;
};

export const useUpdateSettings = () => {
  const { t } = useTranslation();
  return useMutation(
    ({ newSettings }: UpdateSettingsMutationProps) =>
      apiClient.put(`/settings/`, newSettings),
    {
      onSuccess: () => {
        toast.success<string>(t("Settings updated succesfully"));
        queryClient.invalidateQueries("settings");
      },
      onError: () => {
        toast.error<string>(t("Unable to update settings"));
      },
    },
  );
};

export function useSettings(options = {}) {
  return useQuery<ISettings, Error>("settings", fetchSettings, options);
}

export default useSettings;
