import React, { FC, ReactNode } from "react";
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router";
import { PlusOutlined } from "@ant-design/icons";
import { Button, PageHeader } from "antd";

const MarketsPageHeader: FC<ReactNode> = ({ children }) => {
  const { t } = useTranslation();
  const history = useHistory();
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
            history.push("/app/markets/add");
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
