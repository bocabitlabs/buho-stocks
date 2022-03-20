import React, { ReactNode } from "react";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";
import { DeleteOutlined, LinkOutlined } from "@ant-design/icons";
import { Button, PageHeader, Popconfirm, Tag } from "antd";
import breadCrumbRender from "breadcrumbs";
import CountryFlag from "components/CountryFlag/CountryFlag";
import { useDeleteCompany } from "hooks/use-companies/use-companies";

interface Props {
  companyName: string;
  companyTicker: string;
  companyLogo: string;
  companyCountryCode: string;
  portfolioName: string;
  companyUrl: string;
  children: ReactNode;
}

function CompanyDetailsPageHeader({
  companyName,
  companyTicker,
  companyLogo,
  companyUrl,
  companyCountryCode,
  portfolioName,
  children,
}: Props) {
  const { t } = useTranslation();
  const { id, companyId } = useParams();

  const routes = [
    {
      path: `/app/portfolios/${id}`,
      breadcrumbName: portfolioName || t("Loading..."),
    },
    {
      path: `/app/portfolios/${id}/companies/${companyId}`,
      breadcrumbName: companyName || t("Loading..."),
    },
  ];
  const { mutate: deleteCompany } = useDeleteCompany();

  function confirmDelete() {
    deleteCompany({ portfolioId: +id!, companyId: +companyId! });
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
        <Tag color="blue" key="url" style={{ marginLeft: 16 }}>
          <a href={`${companyUrl}`} target="_blank" rel="noopener noreferrer">
            <LinkOutlined />
          </a>
        </Tag>,
      ]}
      extra={[
        <Popconfirm
          key="portfolio-delete-header"
          title={t("Delete this company?")}
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
