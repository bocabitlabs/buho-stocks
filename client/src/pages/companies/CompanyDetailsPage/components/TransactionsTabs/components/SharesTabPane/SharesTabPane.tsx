import { useContext, useState } from "react";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";
import { Button, Group, Loader, Stack } from "@mantine/core";
import SharesListTable from "./components/SharesListTable/SharesListTable";
import SharesTransactionFormProvider from "./components/SharesTransactionForm/SharesTransactionFormProvider";
import {
  LanguageContext,
  LanguageProvider,
} from "components/ListLanguageProvider/ListLanguageProvider";
import { ICurrency } from "types/currency";

interface Props {
  portfolioBaseCurrency: string;
  companyBaseCurrency: ICurrency;
}

function SharesListContent({
  companyBaseCurrency,
  portfolioBaseCurrency,
}: Props) {
  const mrtLocalization = useContext(LanguageContext);

  return mrtLocalization ? (
    <SharesListTable
      companyBaseCurrency={companyBaseCurrency}
      portfolioBaseCurrency={portfolioBaseCurrency}
      mrtLocalization={mrtLocalization}
    />
  ) : (
    <Loader />
  );
}

export default function SharesTabPane({
  companyBaseCurrency,
  portfolioBaseCurrency,
}: Props) {
  const { t } = useTranslation();
  const { companyId } = useParams();
  const [isModalVisible, setIsModalVisible] = useState(false);

  const showModal = () => {
    setIsModalVisible(true);
  };

  const onCloseCallback = () => {
    setIsModalVisible(false);
  };
  return (
    <Stack>
      <Group>
        <Button
          key="add-dividends-button"
          variant="primary"
          onClick={showModal}
          mt={20}
        >
          {t("+ Shares")}
        </Button>
      </Group>

      <SharesTransactionFormProvider
        companyId={+companyId!}
        isVisible={isModalVisible}
        onCloseCallback={onCloseCallback}
        companyBaseCurrency={companyBaseCurrency}
        portfolioBaseCurrency={portfolioBaseCurrency}
      />
      <LanguageProvider>
        <SharesListContent
          companyBaseCurrency={companyBaseCurrency}
          portfolioBaseCurrency={portfolioBaseCurrency}
        />
      </LanguageProvider>
    </Stack>
  );
}
