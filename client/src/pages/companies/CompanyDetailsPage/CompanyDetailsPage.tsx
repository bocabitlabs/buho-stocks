import { ReactElement } from "react";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";
import { Alert, Grid, Loader } from "@mantine/core";
import { IconInfoCircle } from "@tabler/icons-react";
import Charts from "./components/Charts/Charts";
import CompanyDetailsPageHeader from "./components/CompanyDetailsPageHeader/CompanyDetailsPageHeader";
import CompanyExtraInfo from "./components/CompanyExtraInfo/CompanyExtraInfo";
import CompanyStatsProvider from "./components/CompanyStats/CompanyStatsProvider";
import TransactionsTabs from "./components/TransactionsTabs/TransactionsTabs";
import { useCompany } from "hooks/use-companies/use-companies";

export default function CompanyDetailsPage(): ReactElement {
  const { t } = useTranslation();
  const { id, companyId } = useParams();
  const { data: company, isFetching, error } = useCompany(+id!, +companyId!);
  const icon = <IconInfoCircle />;

  if (isFetching || !company) {
    return <Loader />;
  }

  if (error) {
    return (
      <Alert
        variant="light"
        color="red"
        title={t("Unable to load company")}
        icon={icon}
      >
        {error.message}
      </Alert>
    );
  }

  if (!companyId) {
    return (
      <Alert
        variant="light"
        color="red"
        title={t("Company not found")}
        icon={icon}
      />
    );
  }

  return (
    <Grid p={20}>
      <Grid.Col span={12}>
        <CompanyDetailsPageHeader company={company} />
      </Grid.Col>
      <Grid.Col span={12}>
        <CompanyExtraInfo companyDescription={company.description} />
      </Grid.Col>
      <Grid.Col span={12}>
        <CompanyStatsProvider
          companyId={companyId}
          firstYear={company.firstYear}
        />
      </Grid.Col>
      <Grid.Col span={12}>
        <Charts
          stats={company.stats}
          portfolioCurrency={company.portfolio.baseCurrency}
        />
      </Grid.Col>
      <Grid.Col span={12}>
        <TransactionsTabs
          companyBaseCurrency={company.baseCurrency}
          companyDividendsCurrency={company.dividendsCurrency}
          portfolioBaseCurrency={company.portfolio.baseCurrency}
        />
      </Grid.Col>
    </Grid>
  );
}
