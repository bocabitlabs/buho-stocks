import React, { FC, ReactNode, useContext, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Spin } from "antd";
import { CompaniesContext } from "contexts/companies";
import { PortfoliosContext } from "contexts/portfolios";

export interface IParams {
  id: string;
  companyId: string;
}

const CompanyDetailsLoader: FC<ReactNode> = ({ children }) => {
  const {
    isLoading,
    company,
    getById: getCompany
  } = useContext(CompaniesContext);

  const { portfolio, getById: getPortfolio } = useContext(PortfoliosContext);

  const params = useParams<IParams>();
  const { id, companyId } = params;
  console.log("ID: ", id);

  useEffect(() => {
    if (companyId) {
      getCompany(+companyId);
    }
  }, [getCompany, companyId]);

  useEffect(() => {
    if (id) {
      getPortfolio(+id);
    }
  }, [getPortfolio, id]);

  if (isLoading || !company || !portfolio) {
    return <Spin />;
  }

  return <>{children}</>;
};

export default CompanyDetailsLoader;
