import { useMutation, useQuery } from "react-query";
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
  return useMutation(
    ({ newSettings }: UpdateSettingsMutationProps) =>
      apiClient.put(`/settings/`, newSettings),
    {
      onSuccess: () => {
        queryClient.invalidateQueries("settings");
      },
    },
  );
};

export function useSettings(options = {}) {
  return useQuery<ISettings, Error>("settings", fetchSettings, options);
}

export default useSettings;
