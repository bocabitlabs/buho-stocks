import React, { FC, ReactNode } from "react";

import { PageHeader } from "antd";
import { useTranslation } from "react-i18next";

const MarketsEditPageHeader: FC<ReactNode> = ({ children }) => {
  const { t } = useTranslation();
  return (
    <PageHeader className="site-page-header" title={t("Edit market")}>
      {children}
    </PageHeader>
  );
};

export default MarketsEditPageHeader;
