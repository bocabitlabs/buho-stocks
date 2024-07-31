import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";
import { Button, Group, Stack } from "@mantine/core";
import DividendsListTable from "./components/DividendsListTable/DividendsListTable";
import DividendsTransactionFormProvider from "./components/DividendsTransactionForm/DividendsTransactionFormProvider";
import { ICurrency } from "types/currency";

interface Props {
  portfolioBaseCurrency: string;
  companyDividendsCurrency: ICurrency;
}

export default function DividendsTabPane({
  companyDividendsCurrency,
  portfolioBaseCurrency,
}: Props) {
  const { t } = useTranslation();
  const { companyId } = useParams();
  const [isDividendsModalVisible, setIsDividendsModalVisible] = useState(false);

  const showDividendsModal = () => {
    setIsDividendsModalVisible(true);
  };

  const onCloseCallback = () => {
    setIsDividendsModalVisible(false);
  };
  return (
    <Stack>
      <Group>
        <Button
          key="add-dividends-button"
          variant="primary"
          onClick={showDividendsModal}
          mt={20}
        >
          {t("+ Dividends")}
        </Button>
      </Group>

      <DividendsTransactionFormProvider
        companyId={+companyId!}
        isVisible={isDividendsModalVisible}
        onCloseCallback={onCloseCallback}
        companyDividendsCurrency={companyDividendsCurrency}
        portfolioBaseCurrency={portfolioBaseCurrency}
      />
      <DividendsListTable
        companyDividendsCurrency={companyDividendsCurrency}
        portfolioBaseCurrency={portfolioBaseCurrency}
      />
    </Stack>
  );
}
