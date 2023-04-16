import React, { ReactNode } from "react";
import { useTranslation } from "react-i18next";
import { PageHeader } from "@ant-design/pro-layout";
import { Typography, theme } from "antd";
import breadCrumbRender from "breadcrumbs";

interface Props {
  children: ReactNode;
}
const { useToken } = theme;

function SectorsPageHeader({ children }: Props) {
  const { t } = useTranslation();
  const { token } = useToken();
  const items = [
    {
      path: `/sectors`,
      title: t("Sectors"),
    },
  ];
  return (
    <PageHeader
      className="site-page-header"
      style={{
        background: token.colorBgContainer,
      }}
      title={<Typography.Title level={2}>{t("Sectors")}</Typography.Title>}
      breadcrumb={{ items }}
      breadcrumbRender={breadCrumbRender}
    >
      {children}
    </PageHeader>
  );
}

export default SectorsPageHeader;
