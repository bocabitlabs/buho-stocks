import { useTranslation } from "react-i18next";
import { Group, Title } from "@mantine/core";

function SettingsPageHeader() {
  const { t } = useTranslation();

  return (
    <Group justify="space-between">
      <Title order={1} textWrap="pretty">
        {t("Settings")}
      </Title>
    </Group>
  );
}

export default SettingsPageHeader;
