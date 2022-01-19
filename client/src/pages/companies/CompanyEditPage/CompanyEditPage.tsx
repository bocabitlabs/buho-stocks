import React, { ReactElement } from "react";
import { useParams } from "react-router-dom";
import { Spin } from "antd";
import CompanyEditPageHeader from "./components/CompanyEditPageHeader/CompanyEditPageHeader";
import CompanyAddEditForm from "components/CompanyAddEditForm/CompanyAddEditForm";
import { useCompany } from "hooks/use-companies/use-companies";

export default function CompanyEditPage(): ReactElement {
  const { id, companyId } = useParams();
  const portfolioIdString: string = id!;
  const { data: company } = useCompany(+id!, +companyId!);

  if (!company) {
    return <Spin />;
  }

  return (
    <CompanyEditPageHeader
      companyName={company.name}
      companyTicker={company.ticker}
      companyCountryCode={company.countryCode}
      portfolioName={company.portfolio.name}
    >
      <CompanyAddEditForm portfolioId={portfolioIdString} company={company} />
    </CompanyEditPageHeader>
  );
}
