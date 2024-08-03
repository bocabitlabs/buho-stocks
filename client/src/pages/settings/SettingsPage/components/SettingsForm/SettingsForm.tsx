import { useEffect, useMemo } from "react";
import { useTranslation } from "react-i18next";
import {
  Button,
  Checkbox,
  Group,
  Paper,
  Select,
  Stack,
  TextInput,
  Title,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { useTimezones } from "hooks/use-markets/use-markets";
import {
  useSettings,
  useUpdateSettings,
} from "hooks/use-settings/use-settings";
import { ITimezone } from "types/market";
import { ISettingsFormFields } from "types/settings";

function SettingsForm() {
  const { data: settings, error, isLoading } = useSettings();
  const { t, i18n } = useTranslation();
  const { data: timezones } = useTimezones();

  const form = useForm<ISettingsFormFields>({
    mode: "uncontrolled",
    initialValues: {
      language: settings?.language ?? "en",
      timezone: settings?.timezone ?? "UTC",
      sentryDsn: settings?.sentryDsn ?? "",
      sentryEnabled: settings?.sentryEnabled || false,
      backendHostname: settings?.backendHostname ?? "",
      companySortBy: settings?.companySortBy ?? "",
      companyDisplayMode: settings?.companyDisplayMode ?? "",
      mainPortfolio: settings?.mainPortfolio ?? "",
      portfolioSortBy: settings?.portfolioSortBy ?? "",
      portfolioDisplayMode: settings?.portfolioDisplayMode ?? "",
    },
  });

  const onSuccess = () => {
    form.reset();
    i18n.changeLanguage(settings?.language);
  };

  const { mutate: updateSettings } = useUpdateSettings({
    onSuccess,
  });

  const timezonesOptions = useMemo(() => {
    const tzOptions = timezones?.map((timezone: ITimezone) => ({
      value: timezone.name,
      label: t(timezone.name),
    }));
    return tzOptions;
  }, [timezones, t]);

  const onSubmit = (values: any) => {
    updateSettings({ newSettings: values });
  };

  useEffect(() => {
    if (settings) {
      form.setValues({
        language: settings.language,
        timezone: settings.timezone,
        sentryDsn: settings.sentryDsn,
        sentryEnabled: settings.sentryEnabled,
        backendHostname: settings.backendHostname,
      });
    }
    // We don't want form to be here
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [settings]);

  if (isLoading) {
    return <div>{t("Fetching settings...")}</div>;
  }

  if (error) {
    return <div>{t("Unable to fetch settings.")}</div>;
  }

  return (
    <Stack mt={20}>
      <Title order={2}>{t("Application Settings")}</Title>
      <Paper p="lg" shadow="xs">
        <form onSubmit={form.onSubmit(onSubmit)}>
          <Select
            mt="md"
            withAsterisk
            searchable
            label={t("Select a language")}
            data={[
              { value: "en", label: "English" },
              { value: "es", label: "Español" },
            ]}
            value={form.getValues().language}
            // eslint-disable-next-line react/jsx-props-no-spreading
            {...form.getInputProps("language")}
            required
          />

          <Select
            mt="md"
            withAsterisk
            searchable
            label={t("Timezone")}
            data={timezonesOptions}
            value={form.getValues().timezone}
            // eslint-disable-next-line react/jsx-props-no-spreading
            {...form.getInputProps("timezone")}
            required
          />

          <Checkbox
            mt="md"
            label={t("Sentry enabled")}
            key={form.key("sentryEnabled")}
            // eslint-disable-next-line react/jsx-props-no-spreading
            {...form.getInputProps("sentryEnabled", { type: "checkbox" })}
          />

          <TextInput
            withAsterisk
            label={t("Sentry DSN")}
            key={form.key("sentryDsn")}
            // eslint-disable-next-line react/jsx-props-no-spreading
            {...form.getInputProps("sentryDsn")}
          />

          <TextInput
            withAsterisk
            label={t("Backend hostname")}
            key={form.key("backendHostname")}
            // eslint-disable-next-line react/jsx-props-no-spreading
            {...form.getInputProps("backendHostname")}
          />
          <Group justify="space-between" mt="md">
            <Button type="submit" color="blue">
              {t("Update settings")}
            </Button>
          </Group>
        </form>
      </Paper>
    </Stack>
  );
}

export default SettingsForm;
