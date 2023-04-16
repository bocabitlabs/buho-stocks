import React, { ReactNode } from "react";
import { useTranslation } from "react-i18next";
import { PageHeader } from "@ant-design/pro-layout";
import { Typography, theme } from "antd";
import breadCrumbRender from "breadcrumbs";

interface Props {
  children: ReactNode;
}
const { useToken } = theme;

function ImportFromBrokerPageHeader({ children }: Props) {
  const { t } = useTranslation();
  const { token } = useToken();
  const routes = [
    {
      path: `/import`,
      title: t("Import from CSV"),
    },
  ];
  return (
    <PageHeader
      className="site-page-header"
      style={{
        background: token.colorBgContainer,
      }}
      title={
        <Typography.Title level={2}>
          {t("Import from Interactive Brokers")}
        </Typography.Title>
      }
      breadcrumb={{ items: routes }}
      breadcrumbRender={breadCrumbRender}
    >
      {children}
    </PageHeader>
  );
}

export default ImportFromBrokerPageHeader;
