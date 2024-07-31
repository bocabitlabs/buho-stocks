import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Button, Group, Title } from "@mantine/core";
import { IconPlus } from "@tabler/icons-react";
import ExchangeRateAddEditForm from "../ExchangeRateForm/ExchangeRateForm";

function ExchangeRatesPageHeader() {
  const { t } = useTranslation();
  const [isModalVisible, setIsModalVisible] = useState(false);

  const showModal = () => {
    setIsModalVisible(true);
  };

  const onClose = () => {
    setIsModalVisible(false);
  };

  return (
    <Group justify="space-between">
      <Title order={1} textWrap="pretty">
        {t("Markets")}
      </Title>
      <Button leftSection={<IconPlus />} onClick={showModal}>
        {t("Add exchange rate")}
      </Button>
      <ExchangeRateAddEditForm
        isVisible={isModalVisible}
        onCloseCallback={onClose}
      />
    </Group>
  );
}

export default ExchangeRatesPageHeader;
