import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Button, Group, Title } from "@mantine/core";
import { IconPlus } from "@tabler/icons-react";
import PortfolioFormProvider from "../PortfolioForm/PortfolioFormProvider";

function HomePageHeader() {
  const { t } = useTranslation();
  const [isModalVisible, setIsModalVisible] = useState(false);

  const showModal = () => {
    setIsModalVisible(true);
  };

  const onClose = () => {
    setIsModalVisible(false);
  };

  console.log(JSON.stringify(isModalVisible));

  return (
    <Group justify="space-between">
      <Title order={1} mt="md" textWrap="pretty">
        {t("Portfolios")}
      </Title>
      <Button onClick={showModal} leftSection={<IconPlus />}>
        {t("Add portfolio")}
      </Button>
      <PortfolioFormProvider
        isVisible={isModalVisible}
        onCloseCallback={onClose}
      />
    </Group>
  );
}

export default HomePageHeader;
