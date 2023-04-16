import { ReactNode, useState } from "react";
import { useTranslation } from "react-i18next";
import { PageHeader } from "@ant-design/pro-layout";
import { Button, Typography, theme } from "antd";
import StockPriceAddEditForm from "../StockPriceAddEditForm/StockPriceAddEditForm";
import breadCrumbRender from "breadcrumbs";

interface Props {
  children: ReactNode;
}
const { useToken } = theme;

function StockPricesPageHeader({ children }: Props) {
  const { t } = useTranslation();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const { token } = useToken();
  const routes = [
    {
      path: `/stock-prices`,
      title: t("Stock Prices"),
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
      style={{
        background: token.colorBgContainer,
      }}
      title={<Typography.Title level={2}>{t("Stock prices")}</Typography.Title>}
      breadcrumb={{ items: routes }}
      breadcrumbRender={breadCrumbRender}
      extra={[
        <Button type="primary" key="er-add-header" onClick={showModal}>
          {t("Add exchange rate")}
        </Button>,
      ]}
    >
      {children}
      <StockPriceAddEditForm
        title={t("Add new stock price")}
        okText={t("Create")}
        isModalVisible={isModalVisible}
        onCreate={onCreate}
        onCancel={onCancel}
      />
    </PageHeader>
  );
}

export default StockPricesPageHeader;
