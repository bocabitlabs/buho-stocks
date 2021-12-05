import React, { ReactElement, useContext } from "react";
import { useTranslation } from "react-i18next";
import { Spin, Typography } from "antd";
import { CompaniesContext } from "contexts/companies";

export default function CompanyInfo(): ReactElement {
  const { t } = useTranslation();
  const {
    isLoading,
    company
    // getById: getCompanyById
  } = useContext(CompaniesContext);

  // useEffect(() => {
  //   const getDetails = async () => {
  //     getCompanyById(+companyId);
  //   };
  //   getDetails();
  // }, [getCompanyById, companyId]);

  if (isLoading || !company) {
    return <Spin />;
  }

  return (
    <>
      <Typography.Paragraph>
        {t(company.sector.name)} - {t(company.sector.name)}
      </Typography.Paragraph>
      <Typography.Paragraph>
        {company.description !== "undefined" &&
        company.description !== undefined
          ? company.description
          : ""}
      </Typography.Paragraph>
    </>
  );
}
