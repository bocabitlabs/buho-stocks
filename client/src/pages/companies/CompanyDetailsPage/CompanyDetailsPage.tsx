import React, { ReactElement, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Spin } from "antd";
import useFetch from "use-http";
import CompanyDetailsPageHeader from "./components/CompanyDetailsPageHeader/CompanyDetailsPageHeader";
import CompanyExtraInfo from "./components/CompanyExtraInfo/CompanyExtraInfo";
import CompanyInfo from "./components/CompanyInfo/CompanyInfo";
import Stats from "./components/Stats/Stats";
import TransactionsTabs from "./components/TransactionsTabs/TransactionsTabs";
import { ICompany } from "types/company";

export default function CompanyDetailsPage(): ReactElement {
  const { id, companyId } = useParams();
  const [company, setCompany] = useState<ICompany | null>(null);
  const { response, get } = useFetch(`portfolios/${id}/companies`);
  useEffect(() => {
    async function loadInitialCompany() {
      const initialData = await get(`${companyId}/`);
      if (response.ok) setCompany(initialData);
    }
    loadInitialCompany();
  }, [response.ok, get, id, companyId]);

  if (!company) {
    return <Spin />;
  }

  return (
    <CompanyDetailsPageHeader
      companyName={company.name}
      companyTicker={company.ticker}
      companyLogo={company.logo}
      companyCountryCode={company.countryCode}
      portfolioName={company.portfolio.name}
    >
      <CompanyInfo
        companySectorName={company.sector.name}
        companySuperSectorName={company.sector.superSector?.name}
        marketName={company.market.name}
        currencySymbol={company.baseCurrency.symbol}
        dividendsCurrencySymbol={company.dividendsCurrency.symbol}
      />
      <Stats companyId={companyId} />
      <TransactionsTabs />
      <CompanyExtraInfo companyDescription={company.description} />
    </CompanyDetailsPageHeader>
  );
}
