import { useMutation, useQuery, useQueryClient } from "react-query";
import axios from "axios";
import { getAxiosOptionsWithAuth } from "api/api-client";
import { ISettingsFormFields } from "types/settings";

interface UpdateSettingsMutationProps {
  newSettings: ISettingsFormFields;
  id: number;
}

export const fetchSettings = async () => {
  const apiUrl = "/api/v1/settings/";
  const { data } = await axios.get(apiUrl, getAxiosOptionsWithAuth());
  return data;
};

export const useUpdateSettings = () => {
  const queryClient = useQueryClient();

  return useMutation(
    ({ id, newSettings }: UpdateSettingsMutationProps) =>
      axios.put(
        `/api/v1/settings/${id}/`,
        newSettings,
        getAxiosOptionsWithAuth(),
      ),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["settings"]);
      },
    },
  );
};

export function useSettings(options = {}) {
  return useQuery("settings", fetchSettings, options);
}

export default useSettings;
