import React, { ReactElement } from "react";
import { useParams } from "react-router-dom";
import { Spin } from "antd";
import DividendsTransactionEditPageHeader from "./components/DividendsTransactioneditPageHeader/DividendsTransactionEditPageHeader";
import DividendsTransactionAddEditForm from "components/DividendsTransactionAddEditForm/DividendsTransactionAddEditForm";
import { useCompany } from "hooks/use-companies/use-companies";
import { useDividendsTransaction } from "hooks/use-dividends-transactions/use-dividends-transactions";
import { usePortfolio } from "hooks/use-portfolios/use-portfolios";

export default function DividendsTransactionsEditPage(): ReactElement {
  const { id, companyId, transactionId } = useParams();
  const { data: company } = useCompany(+id!, +companyId!);
  const { data: portfolio } = usePortfolio(+id!);
  const { data: transaction } = useDividendsTransaction(
    +companyId!,
    +transactionId!,
  );

  if (!company || !portfolio || !transaction) {
    return <Spin />;
  }
  return (
    <DividendsTransactionEditPageHeader
      companyName={company.name}
      companyTicker={company.ticker}
      companyCountryCode={company.countryCode}
      portfolioName={company.portfolio.name}
    >
      <DividendsTransactionAddEditForm
        transaction={transaction}
        companyBaseCurrency={company.baseCurrency}
        portfolioBaseCurrency={portfolio.baseCurrency}
      />
    </DividendsTransactionEditPageHeader>
  );
}
