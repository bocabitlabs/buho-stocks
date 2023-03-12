import React, { ReactNode } from "react";
import { useTranslation } from "react-i18next";
import { PageHeader } from "antd";
import breadCrumbRender from "breadcrumbs";

interface Props {
  children: ReactNode;
}
function CurrenciesPageHeader({ children }: Props) {
  const { t } = useTranslation();

  const routes = [
    {
      path: `/currencies`,
      breadcrumbName: t("Currencies"),
    },
  ];
  return (
    <PageHeader
      className="site-page-header"
      title={t("Currencies")}
      breadcrumb={{ routes }}
      breadcrumbRender={breadCrumbRender}
    >
      {children}
    </PageHeader>
  );
}

export default CurrenciesPageHeader;
