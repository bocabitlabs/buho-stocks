import React, { FC, ReactNode, useContext, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Spin } from "antd";
import { CompaniesContext } from "contexts/companies";
import { PortfoliosContext } from "contexts/portfolios";
import { RightsTransactionsContext } from "contexts/rights-transactions";

export interface IParams {
  id: string;
  companyId: string;
  transactionId: string;
}

const RightsTransactionLoader: FC<ReactNode> = ({ children }) => {
  const { company, getById: getCompany } = useContext(CompaniesContext);

  const { portfolio, getById: getPortfolio } = useContext(PortfoliosContext);
  const { isLoading: isTransactionLoading, getById: getTransaction } =
    useContext(RightsTransactionsContext);

  const params = useParams<IParams>();
  const { id, companyId, transactionId } = params;

  useEffect(() => {
    console.log(`Company id: ${companyId}`);
    getCompany(+companyId);
  }, [getCompany, companyId]);

  useEffect(() => {
    console.log(`Portfolio id: ${id}`);
    getPortfolio(+id);
  }, [getPortfolio, id]);

  useEffect(() => {
    if (transactionId) {
      console.log(`Transaction id: ${transactionId}`);
      getTransaction(+transactionId);
    }
  }, [getTransaction, transactionId]);

  if (!company || !portfolio || isTransactionLoading) {
    return <Spin />;
  }

  return <>{children}</>;
};

export default RightsTransactionLoader;
