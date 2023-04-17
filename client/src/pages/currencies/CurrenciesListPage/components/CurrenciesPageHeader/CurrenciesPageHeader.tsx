import React, { ReactNode, useState } from "react";
import { useTranslation } from "react-i18next";
import { PageHeader } from "@ant-design/pro-layout";
import { Dropdown, MenuProps, Typography, theme } from "antd";
import CurrencyAddEditForm from "../CurrencyAddEditForm/CurrencyAddEditForm";
import breadCrumbRender from "breadcrumbs";
import { useInitializeCurrencies } from "hooks/use-currencies/use-currencies";

interface Props {
  children: ReactNode;
}
const { useToken } = theme;

function CurrenciesPageHeader({ children }: Props) {
  const { t } = useTranslation();
  const { mutate: initializeCurrencies } = useInitializeCurrencies();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const { token } = useToken();
  const routes = [
    {
      href: `/currencies`,
      title: t("Currencies"),
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

  const onMenuClick: MenuProps["onClick"] = (e) => {
    console.log("click", e);
    if (e.key === "1") {
      console.log("Initializing currencies");
      initializeCurrencies();
    }
  };

  const items = [
    {
      key: "1",
      label: t("Initialize currencies"),
    },
  ];

  return (
    <PageHeader
      className="site-page-header"
      style={{ background: token.colorBgContainer }}
      title={<Typography.Title level={2}>{t("Currencies")}</Typography.Title>}
      breadcrumb={{ items: routes }}
      breadcrumbRender={breadCrumbRender}
      extra={[
        <Dropdown.Button
          menu={{ items, onClick: onMenuClick }}
          type="primary"
          key="company-add-header"
          onClick={showModal}
        >
          {t("Add Currency")}
        </Dropdown.Button>,
      ]}
    >
      {children}
      <CurrencyAddEditForm
        title={t("Add new currency")}
        okText={t("Create")}
        isModalVisible={isModalVisible}
        onCreate={onCreate}
        onCancel={onCancel}
      />
    </PageHeader>
  );
}

export default CurrenciesPageHeader;
