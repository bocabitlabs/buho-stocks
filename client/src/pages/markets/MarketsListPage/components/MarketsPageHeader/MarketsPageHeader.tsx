import React, { ReactNode, useState } from "react";
import { useTranslation } from "react-i18next";
import { PlusOutlined } from "@ant-design/icons";
import { Button, PageHeader } from "antd";
import breadCrumbRender from "breadcrumbs";
import MarketAddEditForm from "pages/markets/MarketsListPage/components/MarketAddEditForm/MarketAddEditForm";

interface Props {
  children: ReactNode;
}
function MarketsPageHeader({ children }: Props) {
  const { t } = useTranslation();
  const [isModalVisible, setIsModalVisible] = useState(false);

  const showModal = () => {
    setIsModalVisible(true);
  };

  const onCreate = (values: any) => {
    console.log("Received values of form: ", values);
    setIsModalVisible(false);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };
  const routes = [
    {
      path: `/app/markets`,
      breadcrumbName: t("Markets"),
    },
  ];
  return (
    <PageHeader
      className="site-page-header"
      title={t("Markets")}
      breadcrumb={{ routes }}
      breadcrumbRender={breadCrumbRender}
      extra={[
        <Button
          key="add-button"
          type="primary"
          icon={<PlusOutlined />}
          onClick={showModal}
        >
          {t("Add market")}
        </Button>,
      ]}
    >
      {children}
      <MarketAddEditForm
        title="Add new market"
        okText="Create"
        isModalVisible={isModalVisible}
        onCreate={onCreate}
        onCancel={handleCancel}
      />
    </PageHeader>
  );
}

export default MarketsPageHeader;
