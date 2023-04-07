import React, { ReactNode, useState } from "react";
import { useTranslation } from "react-i18next";
import { PlusOutlined } from "@ant-design/icons";
import { Button, PageHeader } from "antd";
import PortfolioAddEditForm from "../PortfolioAddEditForm/PortfolioAddEditForm";

interface Props {
  children: ReactNode;
}
function PortfoliosPageHeader({ children }: Props) {
  const { t } = useTranslation();
  const routes = [
    {
      path: "/home",
      breadcrumbName: t("Home"),
    },
  ];
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
    <PageHeader
      className="site-page-header"
      title={t("Portfolios")}
      breadcrumb={{ routes }}
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

export default PortfoliosPageHeader;
