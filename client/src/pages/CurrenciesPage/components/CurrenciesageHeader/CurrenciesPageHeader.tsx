import React, { FC, ReactNode } from "react";
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router";
import { PlusOutlined } from "@ant-design/icons";
import { Button, PageHeader } from "antd";

const CurrenciesPageHeader: FC<ReactNode> = ({ children }) => {
  const { t } = useTranslation();
  const history = useHistory();
  return (
    <PageHeader
      className="site-page-header"
      title={t("Currencies")}
      extra={[
        <Button
          key="add-button"
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => {
            history.push("/app/currencies/add");
          }}
        >
          {t("Add currency")}
        </Button>
      ]}
    >
      {children}
    </PageHeader>
  );
};

export default CurrenciesPageHeader;
