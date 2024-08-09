import { useTranslation } from "react-i18next";
import { notifications } from "@mantine/notifications";
import { useMutation, useQuery } from "@tanstack/react-query";
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

interface MutateProps {
  onSuccess?: Function;
  onError?: Function;
}

export const useUpdateSettings = (props?: MutateProps) => {
  const { t } = useTranslation();
  return useMutation({
    mutationFn: ({ newSettings }: UpdateSettingsMutationProps) =>
      apiClient.put(`/settings/`, newSettings),
    onSuccess: () => {
      props?.onSuccess?.();
      notifications.show({
        color: "green",
        message: t("Settings updated succesfully"),
      });
      queryClient.invalidateQueries({ queryKey: ["settings"] });
    },
    onError: () => {
      props?.onError?.();
      notifications.show({
        color: "red",
        message: t("Unable to update settings"),
      });
    },
  });
};

export function useSettings(options = {}) {
  return useQuery<ISettings, Error>({
    queryKey: ["settings"],
    queryFn: fetchSettings,
    ...options,
  });
}

export default useSettings;
