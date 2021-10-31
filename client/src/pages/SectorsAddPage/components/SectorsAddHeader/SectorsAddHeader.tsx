import React, { FC, ReactNode } from "react";

import { PageHeader } from "antd";
import { useTranslation } from "react-i18next";

const SectorsAddPageHeader: FC<ReactNode> = ({ children }) => {
  const { t } = useTranslation();
  return (
    <PageHeader className="site-page-header" title={t("Add sector")}>
      {children}
    </PageHeader>
  );
};

export default SectorsAddPageHeader;
