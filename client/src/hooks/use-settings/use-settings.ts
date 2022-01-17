import { useMutation, useQuery, useQueryClient } from "react-query";
import axios from "axios";
import { axiosOptionsWithAuth } from "api/api-client";
import { ISettingsFormFields } from "types/settings";

interface UpdateSettingsMutationProps {
  newSettings: ISettingsFormFields;
  id: number;
}

export const fetchSettings = async () => {
  const apiUrl = "/api/v1/settings/";
  const { data } = await axios.get(apiUrl, axiosOptionsWithAuth);
  return data;
};

export const useUpdateSettings = () => {
  const queryClient = useQueryClient();

  return useMutation(
    ({ id, newSettings }: UpdateSettingsMutationProps) =>
      axios.put(`/api/v1/settings/${id}/`, newSettings, axiosOptionsWithAuth),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["settings"]);
      },
    },
  );
};

export function useSettings() {
  return useQuery("settings", fetchSettings);
}

export default useSettings;
