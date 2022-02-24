import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";
import { Button } from "antd";
import DividendsListTable from "../DividendsListTable/DividendsListTable";
import DividendsTransactionAddEditForm from "../DividendsTransactionAddEditForm/DividendsTransactionAddEditForm";
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

  const onDividendsCreate = (values: any) => {
    console.log("Received values of form: ", values);
    setIsDividendsModalVisible(false);
  };

  const onDividendsCancel = () => {
    setIsDividendsModalVisible(false);
  };
  return (
    <div>
      <Button
        key="add-dividends-button"
        type="primary"
        onClick={showDividendsModal}
        style={{ marginBottom: 16 }}
      >
        {t("+ Dividends")}
      </Button>
      <DividendsTransactionAddEditForm
        title="Add dividends transaction"
        okText="Create"
        companyId={+companyId!}
        isModalVisible={isDividendsModalVisible}
        onCreate={onDividendsCreate}
        onCancel={onDividendsCancel}
        companyDividendsCurrency={companyDividendsCurrency}
        portfolioBaseCurrency={portfolioBaseCurrency}
      />
      <DividendsListTable
        companyDividendsCurrency={companyDividendsCurrency}
        portfolioBaseCurrency={portfolioBaseCurrency}
      />
    </div>
  );
}
