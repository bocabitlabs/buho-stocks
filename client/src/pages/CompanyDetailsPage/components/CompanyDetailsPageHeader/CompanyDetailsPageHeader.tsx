import React, { FC, ReactNode, useContext, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { DeleteOutlined } from "@ant-design/icons";
import { Button, PageHeader, Popconfirm, Spin } from "antd";
import CountryFlag from "components/CountryFlag/CountryFlag";
import { CompaniesContext } from "contexts/companies";

interface Props {
  portfolioId: string;
  companyId: string;
  children: ReactNode;
}

const CompanyDetailsPageHeader: FC<Props> = ({
  portfolioId,
  companyId,
  children
}: Props) => {
  const { t } = useTranslation();
  const {
    company,
    getById: getCompanyById,
    deleteById: deleteCompanyById
  } = useContext(CompaniesContext);

  function confirm() {
    deleteCompanyById(+companyId);
  }

  useEffect(() => {
    console.log(`Get portfolio details by ID:${+portfolioId}`);
    const getDetails = async () => {
      getCompanyById(+companyId);
    };
    getDetails();
  }, [getCompanyById, companyId]);

  if (!company) {
    return <Spin />;
  }
  return (
    <PageHeader
      className="site-page-header"
      title={company?.name}
      tags={[
        <CountryFlag code={company.countryCode} key={company.countryCode} />
      ]}
      extra={[
        <Popconfirm
          key="portfolio-delete-header"
          title="Delete this company?"
          onConfirm={() => confirm()}
          okText={t("Yes")}
          cancelText={t("No")}
        >
          <Button icon={<DeleteOutlined />} danger>
            {t("Delete")}
          </Button>
        </Popconfirm>
      ]}
    >
      {children}
    </PageHeader>
  );
};

export default CompanyDetailsPageHeader;
