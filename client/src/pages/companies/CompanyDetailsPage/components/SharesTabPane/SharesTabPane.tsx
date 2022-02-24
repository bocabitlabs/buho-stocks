import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";
import { Button } from "antd";
import SharesListTable from "../SharesListTable/SharesListTable";
import SharesTransactionAddEditForm from "../SharesTransactionAddEditForm/SharesTransactionAddEditForm";
import { ICurrency } from "types/currency";

interface Props {
  portfolioBaseCurrency: string;
  companyBaseCurrency: ICurrency;
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
        key="add-shares-button"
        type="primary"
        onClick={showModal}
        style={{ marginBottom: 16 }}
      >
        {t("+ Shares")}
      </Button>
      <SharesTransactionAddEditForm
        title="Add shares transaction"
        okText="Create"
        companyId={+companyId!}
        isModalVisible={isModalVisible}
        onCreate={onCreate}
        onCancel={onCancel}
        companyBaseCurrency={companyBaseCurrency}
        portfolioBaseCurrency={portfolioBaseCurrency}
      />
      <SharesListTable
        companyBaseCurrency={companyBaseCurrency}
        portfolioBaseCurrency={portfolioBaseCurrency}
      />
    </div>
  );
}
