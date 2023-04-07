import React, { ReactNode } from "react";
import { useTranslation } from "react-i18next";
import { PageHeader } from "antd";
import breadCrumbRender from "breadcrumbs";

interface Props {
  children: ReactNode;
}

function SectorsPageHeader({ children }: Props) {
  const { t } = useTranslation();
  const routes = [
    {
      path: `/sectors`,
      breadcrumbName: t("Sectors"),
    },
  ];

  return (
    <PageHeader
      className="site-page-header"
      title={t("Sectors")}
      breadcrumb={{ routes }}
      breadcrumbRender={breadCrumbRender}
    >
      {children}
    </PageHeader>
  );
}

export default SectorsPageHeader;
