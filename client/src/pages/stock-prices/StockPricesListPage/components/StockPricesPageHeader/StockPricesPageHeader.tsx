import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Button, Group, Title } from "@mantine/core";
import { IconPlus } from "@tabler/icons-react";
import StockPriceFormProvider from "../StockPriceAddEditForm/StockPriceFormProvider";

function StockPricesPageHeader() {
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
        {t("Stock prices")}
      </Title>
      <Button leftSection={<IconPlus />} onClick={showModal}>
        {t("Add stock price")}
      </Button>

      <StockPriceFormProvider
        onCloseCallback={onClose}
        isVisible={isModalVisible}
      />
    </Group>
  );
}

export default StockPricesPageHeader;
