import React, { ReactElement } from "react";
import { useParams } from "react-router-dom";
import { Spin } from "antd";
import SharesTransactionAddPageHeader from "./components/SharesTransactionAddPageHeader/SharesTransactionAddPageHeader";
import SharesTransactionAddEditForm from "components/SharesTransactionAddEditForm/SharesTransactionAddEditForm";
import { useCompany } from "hooks/use-companies/use-companies";
import { usePortfolio } from "hooks/use-portfolios/use-portfolios";

export default function SharesTransactionsAddPage(): ReactElement {
  const { id, companyId } = useParams();
  const { data: company } = useCompany(+id!, +companyId!);
  const { data: portfolio } = usePortfolio(+id!);

  if (!company || !portfolio) {
    return <Spin />;
  }

  return (
    <SharesTransactionAddPageHeader
      companyName={company.name}
      companyTicker={company.ticker}
      companyCountryCode={company.countryCode}
      portfolioName={company.portfolio.name}
    >
      <SharesTransactionAddEditForm
        companyBaseCurrency={company.baseCurrency}
        portfolioBaseCurrency={portfolio.baseCurrency}
      />
    </SharesTransactionAddPageHeader>
  );
}
