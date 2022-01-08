import React, { ReactNode } from "react";
import { useTranslation } from "react-i18next";
import { PageHeader } from "antd";
import breadCrumbRender from "breadcrumbs";

interface Props {
  children: ReactNode;
}
function SectorsAddPageHeader({ children }: Props) {
  const { t } = useTranslation();
  const routes = [
    {
      path: `/app/sectors`,
      breadcrumbName: t("Sectors"),
    },
    {
      path: `/app/sectors/add`,
      breadcrumbName: `${t("Add sector")}`,
    },
  ];
  return (
    <PageHeader
      className="site-page-header"
      title={t("Add sector")}
      breadcrumb={{ routes }}
      breadcrumbRender={breadCrumbRender}
    >
      {children}
    </PageHeader>
  );
}

export default SectorsAddPageHeader;
