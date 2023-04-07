import React, { ReactNode } from "react";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";
import { PageHeader, Spin } from "antd";
import breadCrumbRender from "breadcrumbs";
import CountryFlag from "components/CountryFlag/CountryFlag";

interface Props {
  portfolioName: string;
  portfolioCountryCode: string;
  children: ReactNode;
}

function PortfolioDetailsPageHeader({
  portfolioName,
  portfolioCountryCode,
  children,
}: Props) {
  const { id } = useParams();
  const { t } = useTranslation();
  const routes = [
    {
      path: "/home",
      breadcrumbName: t("Home"),
    },
    {
      path: `/portfolios/${id}`,
      breadcrumbName: portfolioName,
    },
    {
      path: `/portfolios/${id}/log`,
      breadcrumbName: t("Log"),
    },
  ];
  if (!portfolioName) {
    return <Spin />;
  }
  return (
    <PageHeader
      className="site-page-header"
      title={portfolioName}
      subTitle={t("Portfolio transactions log")}
      breadcrumb={{ routes }}
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
