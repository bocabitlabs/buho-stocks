import React, { FC, ReactNode } from "react";
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router";
import { PlusOutlined } from "@ant-design/icons";
import { Button, PageHeader } from "antd";
import getRoute, { PORTFOLIOS_ADD_ROUTE } from "routes";

const PortfoliosPageHeader: FC<ReactNode> = ({ children }) => {
  const { t } = useTranslation();
  const history = useHistory();
  return (
    <PageHeader
      className="site-page-header"
      title={t("Portfolios")}
      extra={[
        <Button
          key="add-button"
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => {
            history.push(getRoute(PORTFOLIOS_ADD_ROUTE));
          }}
        >
          {t("Add portfolio")}
        </Button>
      ]}
    >
      {children}
    </PageHeader>
  );
};

export default PortfoliosPageHeader;
