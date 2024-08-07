import { useContext, useState } from "react";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";
import { Button, Group, Loader, Stack } from "@mantine/core";
import RightsListTable from "./components/RightsListTable/RightsListTable";
import RightsTransactionFormProvider from "./components/RightsTransactionForm/RightsTransactionFormProvider";
import {
  LanguageContext,
  LanguageProvider,
} from "components/ListLanguageProvider/ListLanguageProvider";
import { ICurrency } from "types/currency";

interface Props {
  portfolioBaseCurrency: string;
  companyBaseCurrency: ICurrency;
}

function RightsListContent({
  companyBaseCurrency,
  portfolioBaseCurrency,
}: Props) {
  const mrtLocalization = useContext(LanguageContext);

  return mrtLocalization ? (
    <RightsListTable
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
          {t("+ Rights")}
        </Button>
      </Group>

      <RightsTransactionFormProvider
        companyId={+companyId!}
        isVisible={isModalVisible}
        onCloseCallback={onCloseCallback}
        companyBaseCurrency={companyBaseCurrency}
        portfolioBaseCurrency={portfolioBaseCurrency}
      />
      <LanguageProvider>
        <RightsListContent
          companyBaseCurrency={companyBaseCurrency}
          portfolioBaseCurrency={portfolioBaseCurrency}
        />
      </LanguageProvider>
    </Stack>
  );
}
