import React, { ReactElement } from "react";
import { useParams } from "react-router-dom";
import { Spin } from "antd";
import Charts from "./components/Charts/Charts";
import CompanyDetailsPageHeader from "./components/CompanyDetailsPageHeader/CompanyDetailsPageHeader";
import CompanyExtraInfo from "./components/CompanyExtraInfo/CompanyExtraInfo";
import CompanyInfo from "./components/CompanyInfo/CompanyInfo";
import TransactionsTabs from "./components/TransactionsTabs/TransactionsTabs";
import YearSelector from "./components/YearSelector/YearSelector";
import { useCompany } from "hooks/use-companies/use-companies";

export default function CompanyDetailsPage(): ReactElement {
  const { id, companyId } = useParams();
  const { data: company, isFetching, error } = useCompany(+id!, +companyId!);

  if (isFetching || !company) {
    return (
      <div>
        <Spin /> Loading company...
      </div>
    );
  }

  if (error) {
    <div>Error fetching the data</div>;
  }

  return (
    <CompanyDetailsPageHeader
      companyName={company.name}
      companyTicker={company.ticker}
      companyLogo={company.logo}
      companyCountryCode={company.countryCode}
      portfolioName={company.portfolio.name}
      companyUrl={company.url}
    >
      <CompanyInfo
        companySectorName={company.sector.name}
        companySuperSectorName={company.sector.superSector?.name}
        marketName={company.market.name}
        currencySymbol={company.baseCurrency.symbol}
        dividendsCurrencySymbol={company.dividendsCurrency.symbol}
      />
      <YearSelector companyId={companyId} firstYear={company.firstYear} />
      <Charts stats={company.stats} />
      <TransactionsTabs />
      <CompanyExtraInfo companyDescription={company.description} />
    </CompanyDetailsPageHeader>
  );
}
