import { useTranslation } from "react-i18next";
import { Anchor, Breadcrumbs, Stack, Title } from "@mantine/core";

function ImportFromBrokerPageHeader() {
  const { t } = useTranslation();
  const routes = [
    {
      href: "/",
      title: t("Home"),
      id: "home",
    },
    {
      href: `/import`,
      title: t("Import from CSV"),
      id: "import",
    },
  ].map((item) => (
    <Anchor href={item.href} key={item.id}>
      {item.title}
    </Anchor>
  ));
  return (
    <Stack>
      <Breadcrumbs>{routes}</Breadcrumbs>
      <Title order={1} mt="md" textWrap="pretty">
        {t("Import from Interactive Brokers")}
      </Title>
    </Stack>
  );
}

export default ImportFromBrokerPageHeader;
