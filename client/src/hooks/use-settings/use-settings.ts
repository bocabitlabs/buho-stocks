import { useMutation, useQuery } from "react-query";
import axios from "axios";
import { getAxiosOptionsWithAuth } from "api/api-client";
import queryClient from "api/query-client";
import { ISettings, ISettingsFormFields } from "types/settings";

interface UpdateSettingsMutationProps {
  newSettings: ISettingsFormFields;
  id: number;
}

export const fetchSettings = async () => {
  const { data } = await axios.get<ISettings>(
    "/api/v1/settings/",
    getAxiosOptionsWithAuth(),
  );
  return data;
};

export const useUpdateSettings = () => {
  return useMutation(
    ({ id, newSettings }: UpdateSettingsMutationProps) =>
      axios.put(
        `/api/v1/settings/${id}/`,
        newSettings,
        getAxiosOptionsWithAuth(),
      ),
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
