import React, { ReactNode, useState } from "react";
import { useTranslation } from "react-i18next";
import { PlusOutlined } from "@ant-design/icons";
import { PageHeader } from "@ant-design/pro-layout";
import { Button, Typography, theme } from "antd";
import PortfolioAddEditForm from "../PortfolioAddEditForm/PortfolioAddEditForm";

interface Props {
  children: ReactNode;
}

const { useToken } = theme;

function HomePageHeader({ children }: Props) {
  const { t } = useTranslation();
  const routes = [
    {
      path: "/home",
      title: t("Home"),
    },
  ];
  const [isModalVisible, setIsModalVisible] = useState(false);
  const { token } = useToken();

  const showModal = () => {
    setIsModalVisible(true);
  };

  const onCreate = () => {
    setIsModalVisible(false);
  };

  const onCancel = () => {
    setIsModalVisible(false);
  };

  return (
    <PageHeader
      className="site-page-header"
      style={{
        background: token.colorBgContainer,
      }}
      title={<Typography.Title level={2}>{t("Portfolios")}</Typography.Title>}
      breadcrumb={{ items: routes }}
      extra={[
        <Button
          key="add-button"
          type="primary"
          icon={<PlusOutlined />}
          onClick={showModal}
        >
          {t("Add portfolio")}
        </Button>,
      ]}
    >
      {children}
      <PortfolioAddEditForm
        title={t("Add new portfolio")}
        okText={t("Create")}
        isModalVisible={isModalVisible}
        onCreate={onCreate}
        onCancel={onCancel}
      />
    </PageHeader>
  );
}

export default HomePageHeader;
