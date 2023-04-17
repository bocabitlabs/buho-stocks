import React, { ReactNode, useState } from "react";
import { useTranslation } from "react-i18next";
import { PageHeader } from "@ant-design/pro-layout";
import { Button, Typography, theme } from "antd";
import ExchangeRateAddEditForm from "../ExchangeRateAddEditForm/ExchangeRateAddEditForm";
import breadCrumbRender from "breadcrumbs";

interface Props {
  children: ReactNode;
}
const { useToken } = theme;

function ExchangeRatesPageHeader({ children }: Props) {
  const { t } = useTranslation();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const { token } = useToken();
  const routes = [
    {
      href: `/exchange-rates`,
      title: t("Exchange Rates"),
    },
  ];

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
    <PageHeader
      className="site-page-header"
      style={{ background: token.colorBgContainer }}
      title={
        <Typography.Title level={2}>{t("Exchange rates")}</Typography.Title>
      }
      breadcrumb={{ items: routes }}
      breadcrumbRender={breadCrumbRender}
      extra={[
        <Button type="primary" key="er-add-header" onClick={showModal}>
          {t("Add exchange rate")}
        </Button>,
      ]}
    >
      {children}
      <ExchangeRateAddEditForm
        title={t("Add new exchange rate")}
        okText={t("Create")}
        isModalVisible={isModalVisible}
        onCreate={onCreate}
        onCancel={onCancel}
      />
    </PageHeader>
  );
}

export default ExchangeRatesPageHeader;
