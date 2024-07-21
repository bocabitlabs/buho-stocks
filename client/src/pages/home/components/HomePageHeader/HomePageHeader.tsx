import { useTranslation } from "react-i18next";
import { Group, Title } from "@mantine/core";
import PortfolioAddEditForm from "../PortfolioAddEditForm/PortfolioAddEditForm";

function HomePageHeader() {
  const { t } = useTranslation();

  return (
    <Group justify="space-between">
      <Title order={1} mt="md" textWrap="pretty">
        {t("Portfolios")}
      </Title>

      <PortfolioAddEditForm />
    </Group>
  );
}

export default HomePageHeader;
