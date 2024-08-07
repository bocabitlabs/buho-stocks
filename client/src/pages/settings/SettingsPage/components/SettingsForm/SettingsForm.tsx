import { useMemo } from "react";
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
import { ITimezone } from "types/market";
import { ISettingsFormFields } from "types/settings";

interface Props {
  settings: ISettingsFormFields;
  timezones: ITimezone[];
  onSubmitCallback: (values: ISettingsFormFields) => void;
}

function SettingsForm({
  settings,
  timezones,
  onSubmitCallback,
}: Readonly<Props>) {
  const { t } = useTranslation();

  const form = useForm<ISettingsFormFields>({
    mode: "uncontrolled",
    initialValues: {
      language: settings.language ?? "en",
      timezone: settings.timezone ?? "UTC",
      sentryDsn: settings.sentryDsn ?? "",
      sentryEnabled: settings.sentryEnabled || false,
      backendHostname: settings.backendHostname ?? "",
      companySortBy: settings.companySortBy ?? "",
      companyDisplayMode: settings.companyDisplayMode ?? "",
      mainPortfolio: settings.mainPortfolio ?? "",
      portfolioSortBy: settings.portfolioSortBy ?? "",
      portfolioDisplayMode: settings.portfolioDisplayMode ?? "",
    },
  });

  const timezonesOptions = useMemo(() => {
    const tzOptions = timezones?.map((timezone: ITimezone) => ({
      value: timezone.name,
      label: t(timezone.name),
    }));
    return tzOptions;
  }, [timezones, t]);

  return (
    <Stack mt={20}>
      <Title order={2}>{t("Application Settings")}</Title>
      <Paper p="lg" shadow="xs">
        <form onSubmit={form.onSubmit(onSubmitCallback)}>
          <Select
            mt="md"
            withAsterisk
            searchable
            label={t("Select a language")}
            data={[
              { value: "en", label: "English" },
              { value: "es", label: "Español" },
            ]}
            key={form.key("language")}
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
            key={form.key("timezone")}
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
            mt="md"
            withAsterisk
            label={t("Sentry DSN")}
            key={form.key("sentryDsn")}
            // eslint-disable-next-line react/jsx-props-no-spreading
            {...form.getInputProps("sentryDsn")}
          />

          <TextInput
            mt="md"
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
