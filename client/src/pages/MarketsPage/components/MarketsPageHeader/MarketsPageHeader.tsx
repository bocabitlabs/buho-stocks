import React, { FC, ReactNode } from "react";

import { Button, PageHeader } from "antd";
import { useTranslation } from "react-i18next";
import { PlusOutlined } from "@ant-design/icons";
import { useHistory } from "react-router";

const MarketsPageHeader: FC<ReactNode> = ({ children }) => {
  const { t } = useTranslation();
  const history = useHistory();
  return (
    <PageHeader
      className="site-page-header"
      title={t("Markets")}
      extra={[
        <Button
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
