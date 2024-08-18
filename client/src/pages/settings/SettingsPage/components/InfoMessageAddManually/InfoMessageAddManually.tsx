import { useTranslation } from "react-i18next";
import { Alert } from "@mantine/core";
import { IconInfoCircle } from "@tabler/icons-react";

export default function InfoMessageAddManually() {
  const { t } = useTranslation();
  const infoIcon = <IconInfoCircle />;

  return (
    <Alert variant="light" color="blue" title={t("Info")} icon={infoIcon}>
      {t(
        "Usually, you won't need to add exchange rates manually. They are fetched from the API automatically.",
      )}
    </Alert>
  );
}
