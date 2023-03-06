import React, { ReactNode } from "react";
import { useTranslation } from "react-i18next";
import { PageHeader } from "antd";
import breadCrumbRender from "breadcrumbs";

interface Props {
  children: ReactNode;
}
function MarketsPageHeader({ children }: Props) {
  const { t } = useTranslation();

  const routes = [
    {
      path: `/markets`,
      breadcrumbName: t("Markets"),
    },
  ];
  return (
    <PageHeader
      className="site-page-header"
      title={t("Markets")}
      breadcrumb={{ routes }}
      breadcrumbRender={breadCrumbRender}
    >
      {children}
    </PageHeader>
  );
}

export default MarketsPageHeader;
