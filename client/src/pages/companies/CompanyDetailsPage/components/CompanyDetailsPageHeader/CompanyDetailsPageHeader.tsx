import React, { ReactNode } from "react";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";
import { DeleteOutlined } from "@ant-design/icons";
import { Button, PageHeader, Popconfirm } from "antd";
import useFetch from "use-http";
import breadCrumbRender from "breadcrumbs";
import CountryFlag from "components/CountryFlag/CountryFlag";

interface Props {
  companyName: string;
  companyTicker: string;
  companyLogo: string;
  companyCountryCode: string;
  portfolioName: string;
  children: ReactNode;
}

function CompanyDetailsPageHeader({
  companyName,
  companyTicker,
  companyLogo,
  companyCountryCode,
  portfolioName,
  children,
}: Props) {
  const { t } = useTranslation();
  const { id, companyId } = useParams();
  const companyIdString: string = companyId!;

  const routes = [
    {
      path: `/app/portfolios/${id}`,
      breadcrumbName: portfolioName || "Loading...",
    },
    {
      path: `/app/portfolios/${id}/companies/${companyId}`,
      breadcrumbName: companyName || "Loading...",
    },
  ];
  const { del: deleteCompany } = useFetch(`portfolios/${id}/companies`);

  function confirmDelete() {
    deleteCompany(`${+companyIdString}/`);
  }

  return (
    <PageHeader
      className="site-page-header"
      title={companyName}
      subTitle={companyTicker}
      avatar={{ src: companyLogo }}
      breadcrumb={{ routes }}
      breadcrumbRender={breadCrumbRender}
      tags={[
        <CountryFlag code={companyCountryCode} key={companyCountryCode} />,
      ]}
      extra={[
        <Popconfirm
          key="portfolio-delete-header"
          title="Delete this company?"
          onConfirm={() => confirmDelete()}
          okText={t("Yes")}
          cancelText={t("No")}
        >
          <Button icon={<DeleteOutlined />} type="text" danger />
        </Popconfirm>,
      ]}
    >
      {children}
    </PageHeader>
  );
}

export default CompanyDetailsPageHeader;
