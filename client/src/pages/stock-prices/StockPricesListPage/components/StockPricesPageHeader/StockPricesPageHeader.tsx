import { ReactNode, useState } from "react";
import { useTranslation } from "react-i18next";
import { Button, PageHeader } from "antd";
import StockPriceAddEditForm from "../StockPriceAddEditForm/StockPriceAddEditForm";
import breadCrumbRender from "breadcrumbs";

interface Props {
  children: ReactNode;
}
function StockPricesPageHeader({ children }: Props) {
  const { t } = useTranslation();
  const [isModalVisible, setIsModalVisible] = useState(false);

  const routes = [
    {
      path: `/stock-prices`,
      breadcrumbName: t("Stock Prices"),
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
      title={t("Stock prices")}
      breadcrumb={{ routes }}
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
