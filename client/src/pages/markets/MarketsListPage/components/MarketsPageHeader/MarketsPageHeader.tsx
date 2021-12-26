import React, { FC, ReactNode } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { PlusOutlined } from "@ant-design/icons";
import { Button, PageHeader } from "antd";

const MarketsPageHeader: FC<ReactNode> = ({ children }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  return (
    <PageHeader
      className="site-page-header"
      title={t("Markets")}
      extra={[
        <Button
          key="add-button"
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => {
            navigate("add");
          }}
        >
          {t("Add market")}
        </Button>
      ]}
    >
      {children}
    </PageHeader>
  );
};

export default MarketsPageHeader;
