import React, { ReactElement } from "react";
import { useParams } from "react-router-dom";
import { Spin } from "antd";
import DividendsTransactionAddPageHeader from "./components/DividendsTransactionAddPageHeader/DividendsTransactionAddPageHeader";
import DividendsTransactionAddEditForm from "components/DividendsTransactionAddEditForm/DividendsTransactionAddEditForm";
import { useCompany } from "hooks/use-companies/use-companies";
import { usePortfolio } from "hooks/use-portfolios/use-portfolios";

export default function DividendsTransactionsAddPage(): ReactElement {
  const { id, companyId } = useParams();
  const { data: company } = useCompany(+id!, +companyId!);
  const { data: portfolio } = usePortfolio(+id!);

  if (!company || !portfolio) {
    return <Spin />;
  }

  return (
    <DividendsTransactionAddPageHeader
      companyName={company.name}
      companyTicker={company.ticker}
      companyCountryCode={company.countryCode}
      portfolioName={company.portfolio.name}
    >
      <DividendsTransactionAddEditForm
        companyBaseCurrency={company.baseCurrency}
        portfolioBaseCurrency={portfolio.baseCurrency}
      />
    </DividendsTransactionAddPageHeader>
  );
}
