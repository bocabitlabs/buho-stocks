import React, { ReactElement } from "react";
import { useParams } from "react-router-dom";
import { Spin } from "antd";
import RightsTransactionEditPageHeader from "./components/RightsTransactioneditPageHeader/RightsTransactionEditPageHeader";
import RightsTransactionAddEditForm from "components/RightsTransactionAddEditForm/RightsTransactionAddEditForm";
import { useCompany } from "hooks/use-companies/use-companies";
import { usePortfolio } from "hooks/use-portfolios/use-portfolios";
import { useRightsTransaction } from "hooks/use-rights-transactions/use-rights-transactions";

export default function RightsTransactionsEditPage(): ReactElement {
  const { id, companyId, transactionId } = useParams();
  const { data: company } = useCompany(+id!, +companyId!);
  const { data: portfolio } = usePortfolio(+id!);
  const { data: transaction } = useRightsTransaction(
    +companyId!,
    +transactionId!,
  );

  if (!company || !portfolio) {
    return <Spin />;
  }

  return (
    <RightsTransactionEditPageHeader
      companyName={company.name}
      companyTicker={company.ticker}
      companyCountryCode={company.countryCode}
      portfolioName={company.portfolio.name}
    >
      <RightsTransactionAddEditForm
        transaction={transaction}
        companyBaseCurrency={company.baseCurrency}
        portfolioBaseCurrency={portfolio.baseCurrency}
      />
    </RightsTransactionEditPageHeader>
  );
}
