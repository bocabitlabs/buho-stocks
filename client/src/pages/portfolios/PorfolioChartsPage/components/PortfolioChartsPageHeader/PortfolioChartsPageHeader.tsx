import React, { ReactNode } from "react";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";
import { PageHeader } from "@ant-design/pro-layout";
import { Spin, Typography, theme } from "antd";
import breadCrumbRender from "breadcrumbs";
import CountryFlag from "components/CountryFlag/CountryFlag";

interface Props {
  portfolioName: string;
  portfolioDescription: string;
  portfolioCountryCode: string;
  children: ReactNode;
}
const { useToken } = theme;

function PortfolioChartsPageHeader({
  portfolioName,
  portfolioDescription,
  portfolioCountryCode,
  children,
}: Props) {
  const { t } = useTranslation();
  const { id } = useParams();
  const { token } = useToken();
  const routes = [
    {
      href: `/portfolios/${id}`,
      title: portfolioName,
    },
    {
      href: `/portfolios/${id}/charts`,
      title: `${t("Charts")}`,
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
      subTitle={portfolioDescription}
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

export default PortfolioChartsPageHeader;
