import React, { FC, ReactNode } from "react";
import { useTranslation } from "react-i18next";
import { PageHeader } from "antd";

const ImportFromBrokerPageHeader: FC<ReactNode> = ({ children }) => {
  const { t } = useTranslation();
  return (
    <PageHeader className="site-page-header" title={t("Import from broker")}>
      {children}
    </PageHeader>
  );
};

export default ImportFromBrokerPageHeader;
