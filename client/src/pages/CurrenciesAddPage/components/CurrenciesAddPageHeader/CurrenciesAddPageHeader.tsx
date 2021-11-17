import React, { FC, ReactNode } from "react";
import { useTranslation } from "react-i18next";
import { PageHeader } from "antd";

const CurrenciesAddPageHeader: FC<ReactNode> = ({ children }) => {
  const { t } = useTranslation();
  return (
    <PageHeader className="site-page-header" title={t("Add currency")}>
      {children}
    </PageHeader>
  );
};

export default CurrenciesAddPageHeader;
