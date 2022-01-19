import React, { ReactElement } from "react";
import { useParams } from "react-router-dom";
import { Spin } from "antd";
import RightsTransactionAddPageHeader from "./components/RightsTransactionAddPageHeader/RightsTransactionAddPageHeader";
import SharesTransactionAddEditForm from "components/SharesTransactionAddEditForm/SharesTransactionAddEditForm";
import { useCompany } from "hooks/use-companies/use-companies";
import { usePortfolio } from "hooks/use-portfolios/use-portfolios";

export default function RightsTransactionsAddPage(): ReactElement {
  const { id, companyId } = useParams();
  const { data: company } = useCompany(+id!, +companyId!);
  const { data: portfolio } = usePortfolio(+id!);

  if (!company || !portfolio) {
    return <Spin />;
  }

  return (
    <RightsTransactionAddPageHeader
      companyName={company.name}
      companyTicker={company.ticker}
      companyCountryCode={company.countryCode}
      portfolioName={company.portfolio.name}
    >
      <SharesTransactionAddEditForm
        companyBaseCurrency={company.baseCurrency}
        portfolioBaseCurrency={portfolio.baseCurrency}
      />
    </RightsTransactionAddPageHeader>
  );
}
