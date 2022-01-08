import React, { ReactNode } from "react";
import { useTranslation } from "react-i18next";
import { PageHeader } from "antd";
import breadCrumbRender from "breadcrumbs";

interface Props {
  children: ReactNode;
}
function PortfoliosAddPageHeader({ children }: Props) {
  const { t } = useTranslation();
  const routes = [
    {
      path: `/app/portfolios/add`,
      breadcrumbName: t("Add portfolio"),
    },
  ];
  return (
    <PageHeader
      breadcrumb={{ routes }}
      breadcrumbRender={breadCrumbRender}
      className="site-page-header"
      title={t("Add portfolio")}
    >
      {children}
    </PageHeader>
  );
}

export default PortfoliosAddPageHeader;
