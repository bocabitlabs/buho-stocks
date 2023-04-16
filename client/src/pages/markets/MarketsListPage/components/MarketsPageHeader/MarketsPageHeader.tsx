import React, { ReactNode, useState } from "react";
import { useTranslation } from "react-i18next";
import { PageHeader } from "@ant-design/pro-layout";
import { Dropdown, MenuProps, Typography, theme } from "antd";
import MarketAddEditForm from "../MarketAddEditForm/MarketAddEditForm";
import breadCrumbRender from "breadcrumbs";
import { useInitializeMarkets } from "hooks/use-markets/use-markets";

interface Props {
  children: ReactNode;
}
const { useToken } = theme;

function MarketsPageHeader({ children }: Props) {
  const { t } = useTranslation();
  const { mutate: initializeMarkets } = useInitializeMarkets();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const { token } = useToken();
  const routes = [
    {
      path: `/markets`,
      title: t("Markets"),
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
      console.log("Initializing markets");
      initializeMarkets();
    }
  };

  const items = [
    {
      key: "1",
      label: t("Initialize markets"),
    },
  ];

  return (
    <PageHeader
      className="site-page-header"
      style={{
        background: token.colorBgContainer,
      }}
      title={<Typography.Title level={2}>{t("Markets")}</Typography.Title>}
      breadcrumb={{ items: routes }}
      breadcrumbRender={breadCrumbRender}
      extra={[
        <Dropdown.Button
          menu={{ items, onClick: onMenuClick }}
          type="primary"
          key="company-add-header"
          onClick={showModal}
        >
          {t("Add Market")}
        </Dropdown.Button>,
      ]}
    >
      {children}
      <MarketAddEditForm
        title={t("Add new market")}
        okText={t("Create")}
        isModalVisible={isModalVisible}
        onCreate={onCreate}
        onCancel={onCancel}
      />
    </PageHeader>
  );
}

export default MarketsPageHeader;
