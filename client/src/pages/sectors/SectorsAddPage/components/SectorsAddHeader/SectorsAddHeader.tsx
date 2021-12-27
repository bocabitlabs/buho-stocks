import React, { ReactNode } from "react";
import { useTranslation } from "react-i18next";
import { PageHeader } from "antd";

interface Props {
  children: ReactNode;
}
function SectorsAddPageHeader({ children }: Props) {
  const { t } = useTranslation();
  return (
    <PageHeader className="site-page-header" title={t("Add sector")}>
      {children}
    </PageHeader>
  );
}

export default SectorsAddPageHeader;
