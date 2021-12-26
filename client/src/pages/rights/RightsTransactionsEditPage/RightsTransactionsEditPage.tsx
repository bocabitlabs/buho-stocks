import React, { ReactElement, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Spin } from "antd";
import useFetch from "use-http";
import RightsTransactionEditPageHeader from "./components/RightsTransactioneditPageHeader/RightsTransactionEditPageHeader";
import SharesTransactionAddEditForm from "components/SharesTransactionAddEditForm/SharesTransactionAddEditForm";
import { ICompany } from "types/company";
import { IPortfolio } from "types/portfolio";

export default function RightsTransactionsEditPage(): ReactElement {
  const { id, companyId, transactionId } = useParams();
  const [company, setCompany] = useState<ICompany | null>(null);
  const [portfolio, setPortfolio] = useState<IPortfolio | null>(null);
  const { response, get } = useFetch("portfolios");

  useEffect(() => {
    async function loadInitialCompany() {
      const initialData = await get(`${id}/companies/${companyId}/`);
      if (response.ok) setCompany(initialData);
    }

    loadInitialCompany();
  }, [response.ok, get, id, companyId]);

  useEffect(() => {
    async function loadInitialPortfolio() {
      const initialData = await get(`${id}/`);
      if (response.ok) setPortfolio(initialData);
    }
    loadInitialPortfolio();
  }, [response.ok, get, id, companyId]);

  if (!company || !portfolio) {
    return <Spin />;
  }

  return (
    <RightsTransactionEditPageHeader
      companyName={company.name}
      companyTicker={company.ticker}
      companyCountryCode={company.countryCode}
    >
      <SharesTransactionAddEditForm
        transactionId={transactionId}
        companyBaseCurrency={company.baseCurrency}
        portfolioBaseCurrency={portfolio.baseCurrency}
      />
    </RightsTransactionEditPageHeader>
  );
}
