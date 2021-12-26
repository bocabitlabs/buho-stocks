import React, { FC, ReactNode } from "react";
import { useTranslation } from "react-i18next";
import { PageHeader } from "antd";

const MarketsEditPageHeader: FC<ReactNode> = ({ children }) => {
  const { t } = useTranslation();
  return (
    <PageHeader className="site-page-header" title={t("Edit market")}>
      {children}
    </PageHeader>
  );
};

export default MarketsEditPageHeader;
