import React, { ReactNode } from "react";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";
import { PageHeader } from "antd";
import breadCrumbRender from "breadcrumbs";
import CountryFlag from "components/CountryFlag/CountryFlag";

interface Props {
  companyName: string;
  companyTicker: string;
  companyCountryCode: string;
  portfolioName: string;
  children: ReactNode;
}

function CompanyEditPageHeader({
  companyName,
  companyTicker,
  companyCountryCode,
  portfolioName,
  children,
}: Props) {
  const { t } = useTranslation();
  const { companyId, id } = useParams();
  const routes = [
    {
      path: `/app/portfolios/${id}`,
      breadcrumbName: portfolioName,
    },
    {
      path: `/app/portfolios/${id}/companies/${companyId}`,
      breadcrumbName: companyName,
    },
    {
      path: `/app/portfolios/${id}/companies/${companyId}/edit`,
      breadcrumbName: `${t("Edit")}`,
    },
  ];

  return (
    <PageHeader
      className="site-page-header"
      title={`Edit ${companyName}`}
      subTitle={`${companyTicker}`}
      breadcrumb={{ routes }}
      breadcrumbRender={breadCrumbRender}
      tags={[
        <CountryFlag code={companyCountryCode} key={companyCountryCode} />,
      ]}
    >
      {children}
    </PageHeader>
  );
}

export default CompanyEditPageHeader;
