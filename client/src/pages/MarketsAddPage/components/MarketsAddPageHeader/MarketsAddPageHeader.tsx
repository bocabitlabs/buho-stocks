import React, { FC, ReactNode } from "react";

import { PageHeader } from "antd";
import { useTranslation } from "react-i18next";

const MarketsAddPageHeader: FC<ReactNode> = ({ children }) => {
  const { t } = useTranslation();
  return (
    <PageHeader className="site-page-header" title={t("Add market")}>
      {children}
    </PageHeader>
  );
};

export default MarketsAddPageHeader;
