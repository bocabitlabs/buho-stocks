import React, { ReactNode } from "react";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";
import { PageHeader } from "@ant-design/pro-layout";
import { Spin, Typography, theme } from "antd";
import breadCrumbRender from "breadcrumbs";
import CountryFlag from "components/CountryFlag/CountryFlag";

interface Props {
  portfolioName: string;
  portfolioCountryCode: string;
  children: ReactNode;
}
const { useToken } = theme;

function PortfolioDetailsPageHeader({
  portfolioName,
  portfolioCountryCode,
  children,
}: Props) {
  const { id } = useParams();
  const { t } = useTranslation();
  const { token } = useToken();
  const routes = [
    {
      path: "/home",
      title: t("Home"),
    },
    {
      path: `/portfolios/${id}`,
      title: portfolioName,
    },
    {
      path: `/portfolios/${id}/log`,
      title: t("Log"),
    },
  ];
  if (!portfolioName) {
    return <Spin />;
  }
  return (
    <PageHeader
      className="site-page-header"
      style={{
        background: token.colorBgContainer,
      }}
      title={<Typography.Title level={2}>{portfolioName}</Typography.Title>}
      subTitle={t("Portfolio transactions log")}
      breadcrumb={{ items: routes }}
      breadcrumbRender={breadCrumbRender}
      tags={[
        <CountryFlag code={portfolioCountryCode} key={portfolioCountryCode} />,
      ]}
    >
      {children}
    </PageHeader>
  );
}

export default PortfolioDetailsPageHeader;
