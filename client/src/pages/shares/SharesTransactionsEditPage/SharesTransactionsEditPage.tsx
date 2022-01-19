import React, { ReactElement } from "react";
import { useParams } from "react-router-dom";
import { Spin } from "antd";
import SharesTransactionEditPageHeader from "./components/SharesTransactioneditPageHeader/SharesTransactionEditPageHeader";
import SharesTransactionAddEditForm from "components/SharesTransactionAddEditForm/SharesTransactionAddEditForm";
import { useCompany } from "hooks/use-companies/use-companies";
import { usePortfolio } from "hooks/use-portfolios/use-portfolios";
import { useSharesTransaction } from "hooks/use-shares-transactions/use-shares-transactions";

export default function SharesTransactionsEditPage(): ReactElement {
  const { id, companyId, transactionId } = useParams();
  const { data: company } = useCompany(+id!, +companyId!);
  const { data: portfolio } = usePortfolio(+id!);
  const { data: transaction } = useSharesTransaction(
    +companyId!,
    +transactionId!,
  );

  if (!company || !portfolio) {
    return <Spin />;
  }

  return (
    <SharesTransactionEditPageHeader
      companyName={company.name}
      companyTicker={company.ticker}
      companyCountryCode={company.countryCode}
      portfolioName={company.portfolio.name}
    >
      <SharesTransactionAddEditForm
        transaction={transaction}
        companyBaseCurrency={company.baseCurrency}
        portfolioBaseCurrency={portfolio.baseCurrency}
      />
    </SharesTransactionEditPageHeader>
  );
}
