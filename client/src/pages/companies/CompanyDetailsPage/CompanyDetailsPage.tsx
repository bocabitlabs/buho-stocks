import { ReactElement } from "react";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";
import { Alert } from "antd";
import Charts from "./components/Charts/Charts";
import CompanyDetailsPageHeader from "./components/CompanyDetailsPageHeader/CompanyDetailsPageHeader";
import CompanyExtraInfo from "./components/CompanyExtraInfo/CompanyExtraInfo";
import CompanyInfo from "./components/CompanyInfo/CompanyInfo";
import TransactionsTabs from "./components/TransactionsTabs/TransactionsTabs";
import YearSelector from "./components/YearSelector/YearSelector";
import LoadingSpin from "components/LoadingSpin/LoadingSpin";
import { useCompany } from "hooks/use-companies/use-companies";

export default function CompanyDetailsPage(): ReactElement {
  const { t } = useTranslation();
  const { id, companyId } = useParams();
  const { data: company, isFetching, error } = useCompany(+id!, +companyId!);

  if (isFetching || !company) {
    return <LoadingSpin />;
  }

  if (error) {
    return (
      <Alert
        style={{ marginTop: 20 }}
        showIcon
        message={t("Unable to load company")}
        description={error.message}
        type="error"
      />
    );
  }

  return (
    <CompanyDetailsPageHeader
      companyName={company.name}
      portfolioName={company.portfolio.name}
      companyCountryCode={company.countryCode}
    >
      <CompanyInfo
        companyTicker={company.ticker}
        companyLogo={company.logo}
        companyUrl={company.url}
        companySectorName={company.sector.name}
        companySuperSectorName={company.sector.superSector?.name}
        marketName={company.market.name}
        currencyCode={company.baseCurrency.code}
        dividendsCurrencyCode={company.dividendsCurrency.code}
        isin={company.isin}
      />
      <YearSelector companyId={companyId} firstYear={company.firstYear} />
      <Charts
        stats={company.stats}
        portfolioCurrency={company.portfolio.baseCurrency}
      />
      <TransactionsTabs
        companyBaseCurrency={company.baseCurrency}
        companyDividendsCurrency={company.dividendsCurrency}
        portfolioBaseCurrency={company.portfolio.baseCurrency}
      />
      <CompanyExtraInfo companyDescription={company.description} />
    </CompanyDetailsPageHeader>
  );
}
