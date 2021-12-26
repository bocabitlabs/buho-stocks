import React, { ReactElement, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Spin } from "antd";
import useFetch from "use-http";
import CompanyEditPageHeader from "./components/CompanyEditPageHeader/CompanyEditPageHeader";
import CompanyAddEditForm from "components/CompanyAddEditForm/CompanyAddEditForm";
import { ICompany } from "types/company";

export default function CompanyEditPage(): ReactElement {
  const { id, companyId } = useParams();
  const [company, setCompany] = useState<ICompany | null>(null);
  const { response, get } = useFetch("portfolios");
  const portfolioIdString: string = id!;
  const companyIdString: string = companyId!;

  useEffect(() => {
    async function loadInitialPortfolio() {
      const initialData = await get(`${id}/companies/${companyId}/`);
      if (response.ok) setCompany(initialData);
    }
    loadInitialPortfolio();
  }, [response.ok, get, id, companyId]);

  if (!company) {
    return <Spin />;
  }

  return (
    <CompanyEditPageHeader
      companyName={company.name}
      companyTicker={company.ticker}
      companyCountryCode={company.countryCode}
    >
      <CompanyAddEditForm
        portfolioId={portfolioIdString}
        companyId={companyIdString}
      />
    </CompanyEditPageHeader>
  );
}
