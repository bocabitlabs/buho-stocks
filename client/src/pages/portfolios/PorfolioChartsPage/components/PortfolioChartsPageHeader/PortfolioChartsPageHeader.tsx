import React, { ReactNode } from "react";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";
import { PageHeader, Spin } from "antd";
import breadCrumbRender from "breadcrumbs";
import CountryFlag from "components/CountryFlag/CountryFlag";

interface Props {
  portfolioName: string;
  portfolioDescription: string;
  portfolioCountryCode: string;
  children: ReactNode;
}

function PortfolioChartsPageHeader({
  portfolioName,
  portfolioDescription,
  portfolioCountryCode,
  children,
}: Props) {
  const { t } = useTranslation();
  const { id } = useParams();
  const routes = [
    {
      path: `/portfolios/${id}`,
      breadcrumbName: portfolioName,
    },
    {
      path: `/portfolios/${id}/charts`,
      breadcrumbName: `${t("Charts")}`,
    },
  ];

  if (!portfolioName) {
    return <Spin />;
  }
  return (
    <PageHeader
      className="site-page-header"
      title={portfolioName}
      subTitle={portfolioDescription}
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

export default PortfolioChartsPageHeader;
