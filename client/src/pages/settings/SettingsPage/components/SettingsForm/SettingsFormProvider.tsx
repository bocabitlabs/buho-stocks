import { useTranslation } from "react-i18next";
import { Alert, Loader } from "@mantine/core";
import SettingsForm from "./SettingsForm";
import { useTimezones } from "hooks/use-markets/use-markets";
import {
  useSettings,
  useUpdateSettings,
} from "hooks/use-settings/use-settings";
import { ISettingsFormFields } from "types/settings";

export default function SettingsFormProvider() {
  const { t, i18n } = useTranslation();
  const { data: settings, error, isLoading, isError } = useSettings();
  const {
    data: timezones,
    isLoading: isLoadingTimezones,
    isError: IsErrorTimezones,
    error: errorTimezones,
  } = useTimezones();

  const onSuccess = () => {
    i18n.changeLanguage(settings?.language);
  };

  const { mutate: updateSettings } = useUpdateSettings({
    onSuccess,
  });

  const onSubmitCallback = (values: ISettingsFormFields) => {
    console.log("values", values);
    updateSettings({ newSettings: values });
  };

  if (isLoading || isLoadingTimezones) {
    return <Loader />;
  }

  if (isError || IsErrorTimezones) {
    return (
      <Alert color="red" title={t("Unable to fetch settings")}>
        {isError && error.message}
        {IsErrorTimezones && errorTimezones.message}
      </Alert>
    );
  }
  if (settings && timezones) {
    return (
      <SettingsForm
        settings={settings}
        timezones={timezones}
        onSubmitCallback={onSubmitCallback}
      />
    );
  }
}
