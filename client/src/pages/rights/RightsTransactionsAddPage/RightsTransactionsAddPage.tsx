import React, { ReactElement, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Spin } from "antd";
import useFetch from "use-http";
import RightsTransactionAddPageHeader from "./components/RightsTransactionAddPageHeader/RightsTransactionAddPageHeader";
import SharesTransactionAddEditForm from "components/SharesTransactionAddEditForm/SharesTransactionAddEditForm";
import { ICompany } from "types/company";
import { IPortfolio } from "types/portfolio";

export default function RightsTransactionsAddPage(): ReactElement {
  const { id, companyId } = useParams();
  const [company, setCompany] = useState<ICompany | null>(null);
  const [portfolio, setPortfolio] = useState<IPortfolio | null>(null);
  const { response, get } = useFetch("portfolios");

  useEffect(() => {
    async function loadInitialCompany() {
      const initialData = await get(`${id}/companies/${companyId}/`);
      if (response.ok) setCompany(initialData);
    }
    async function loadInitialPortfolio() {
      const initialData = await get(`${id}/`);
      if (response.ok) setPortfolio(initialData);
    }
    loadInitialCompany();
    loadInitialPortfolio();
  }, [response.ok, get, id, companyId]);

  if (!company || !portfolio) {
    return <Spin />;
  }

  return (
    <RightsTransactionAddPageHeader
      companyName={company.name}
      companyTicker={company.ticker}
      companyCountryCode={company.countryCode}
    >
      <SharesTransactionAddEditForm
        companyBaseCurrency={company.baseCurrency}
        portfolioBaseCurrency={portfolio.baseCurrency}
      />
    </RightsTransactionAddPageHeader>
  );
}
