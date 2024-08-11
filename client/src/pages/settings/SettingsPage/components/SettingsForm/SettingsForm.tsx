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
  // eslint-disable-next-line no-unused-vars
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
      companySortBy: settings.companySortBy,
      companyDisplayMode: settings.companyDisplayMode,
      language: settings.language,
      mainPortfolio: settings.mainPortfolio,
      portfolioSortBy: settings.portfolioSortBy,
      portfolioDisplayMode: settings.portfolioDisplayMode,
      sentryDsn: settings.sentryDsn,
      sentryEnabled: settings.sentryEnabled,
      displayWelcome: settings.displayWelcome,
      timezone: settings.timezone,
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
            label={t("Sentry DSN")}
            key={form.key("sentryDsn")}
            // eslint-disable-next-line react/jsx-props-no-spreading
            {...form.getInputProps("sentryDsn")}
          />

          <Checkbox
            mt="md"
            label={t("Show welcome screen")}
            key={form.key("displayWelcome")}
            // eslint-disable-next-line react/jsx-props-no-spreading
            {...form.getInputProps("displayWelcome", { type: "checkbox" })}
          />

          <Group justify="space-between" mt="xl">
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
