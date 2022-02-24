import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";
import { Button } from "antd";
import RightsListTable from "../RightsListTable/RightsListTable";
import RightsTransactionAddEditForm from "../RightsTransactionAddEditForm/RightsTransactionAddEditForm";
import { ICurrency } from "types/currency";

interface Props {
  portfolioBaseCurrency: string;
  companyBaseCurrency: ICurrency;
}

export default function RightsTabPane({
  companyBaseCurrency,
  portfolioBaseCurrency,
}: Props) {
  const { t } = useTranslation();
  const { companyId } = useParams();
  const [isModalVisible, setIsModalVisible] = useState(false);

  const showModal = () => {
    setIsModalVisible(true);
  };

  const onCreate = (values: any) => {
    console.log("Received values of form: ", values);
    setIsModalVisible(false);
  };

  const onCancel = () => {
    setIsModalVisible(false);
  };
  return (
    <div>
      <Button
        key="add-rights-button"
        type="primary"
        onClick={showModal}
        style={{ marginBottom: 16 }}
      >
        {t("+ Rights")}
      </Button>
      <RightsTransactionAddEditForm
        title="Add rights transaction"
        okText="Create"
        companyId={+companyId!}
        isModalVisible={isModalVisible}
        onCreate={onCreate}
        onCancel={onCancel}
        companyBaseCurrency={companyBaseCurrency}
        portfolioBaseCurrency={portfolioBaseCurrency}
      />
      <RightsListTable
        companyBaseCurrency={companyBaseCurrency}
        portfolioBaseCurrency={portfolioBaseCurrency}
      />
    </div>
  );
}
