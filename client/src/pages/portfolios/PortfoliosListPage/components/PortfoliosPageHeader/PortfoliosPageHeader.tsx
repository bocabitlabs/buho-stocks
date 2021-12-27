import React, { ReactNode } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { PlusOutlined } from "@ant-design/icons";
import { Button, PageHeader } from "antd";

interface Props {
  children: ReactNode;
}
function PortfoliosPageHeader({ children }: Props) {
  const { t } = useTranslation();
  const navigate = useNavigate();
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
            navigate("add");
          }}
        >
          {t("Add portfolio")}
        </Button>
      ]}
    >
      {children}
    </PageHeader>
  );
}

export default PortfoliosPageHeader;
