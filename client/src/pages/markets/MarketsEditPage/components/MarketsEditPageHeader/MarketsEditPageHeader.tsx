import React, { ReactNode } from "react";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";
import { PageHeader } from "antd";
import breadCrumbRender from "breadcrumbs";

interface Props {
  marketName: string;
  children: ReactNode;
}
function MarketsEditPageHeader({ marketName, children }: Props) {
  const { id } = useParams();
  const { t } = useTranslation();
  const routes = [
    {
      path: `/app/markets`,
      breadcrumbName: t("Markets"),
    },
    {
      path: `/app/markets/${id}`,
      breadcrumbName: `${t("Edit")} ${marketName}`,
    },
  ];
  return (
    <PageHeader
      className="site-page-header"
      title={t("Edit market")}
      breadcrumb={{ routes }}
      breadcrumbRender={breadCrumbRender}
    >
      {children}
    </PageHeader>
  );
}

export default MarketsEditPageHeader;
