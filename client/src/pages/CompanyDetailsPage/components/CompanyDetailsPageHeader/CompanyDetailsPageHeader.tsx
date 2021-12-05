import React, { FC, useContext } from "react";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";
import { DeleteOutlined } from "@ant-design/icons";
import { Button, PageHeader, Popconfirm, Spin } from "antd";
import CountryFlag from "components/CountryFlag/CountryFlag";
import { CompaniesContext } from "contexts/companies";

export interface IParams {
  companyId: string;
}

const CompanyDetailsPageHeader: FC = ({ children }) => {
  const { t } = useTranslation();
  const { company, deleteById: deleteCompanyById } =
    useContext(CompaniesContext);
  const params = useParams<IParams>();
  const { companyId } = params;

  function confirm() {
    deleteCompanyById(+companyId);
  }

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
