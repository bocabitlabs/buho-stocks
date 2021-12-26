import React, { FC, ReactNode } from "react";
import { useTranslation } from "react-i18next";
import { PageHeader } from "antd";

const CurrenciesPageHeader: FC<ReactNode> = ({ children }) => {
  const { t } = useTranslation();
  return (
    <PageHeader className="site-page-header" title={t("Currencies")}>
      {children}
    </PageHeader>
  );
};

export default CurrenciesPageHeader;
