import React, { ReactNode } from "react";
import { useTranslation } from "react-i18next";
import { PageHeader } from "@ant-design/pro-layout";
import { Typography, theme } from "antd";
import breadCrumbRender from "breadcrumbs";

interface Props {
  children: ReactNode;
}
const { useToken } = theme;

function SettingsPageHeader({ children }: Props) {
  const { t } = useTranslation();
  const { token } = useToken();
  const routes = [
    {
      path: `/settings`,
      title: t("Settings"),
    },
  ];
  return (
    <PageHeader
      className="site-page-header"
      style={{
        background: token.colorBgContainer,
      }}
      title={<Typography.Title level={2}>{t("Settings")}</Typography.Title>}
      breadcrumb={{ items: routes }}
      breadcrumbRender={breadCrumbRender}
    >
      {children}
    </PageHeader>
  );
}

export default SettingsPageHeader;
