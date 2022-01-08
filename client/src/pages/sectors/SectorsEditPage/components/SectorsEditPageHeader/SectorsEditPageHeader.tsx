import React, { ReactNode } from "react";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";
import { PageHeader } from "antd";
import breadCrumbRender from "breadcrumbs";

interface Props {
  sectorName: string;
  children: ReactNode;
}
function SectorsEditPageHeader({ sectorName, children }: Props) {
  const { t } = useTranslation();
  const { id } = useParams();
  const routes = [
    {
      path: `/app/sectors`,
      breadcrumbName: t("Sectors"),
    },
    {
      path: `/app/sectors/${id}`,
      breadcrumbName: `${t("Edit")} ${sectorName}`,
    },
  ];

  return (
    <PageHeader
      className="site-page-header"
      title={t("Edit sector")}
      breadcrumb={{ routes }}
      breadcrumbRender={breadCrumbRender}
    >
      {children}
    </PageHeader>
  );
}

export default SectorsEditPageHeader;
