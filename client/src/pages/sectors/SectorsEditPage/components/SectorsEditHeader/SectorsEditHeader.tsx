import React, { ReactNode } from "react";
import { useTranslation } from "react-i18next";
import { PageHeader } from "antd";

interface Props {
  children: ReactNode;
}
function SectorsEditPageHeader({ children }: Props) {
  const { t } = useTranslation();
  return (
    <PageHeader className="site-page-header" title={t("Edit sector")}>
      {children}
    </PageHeader>
  );
}

export default SectorsEditPageHeader;
