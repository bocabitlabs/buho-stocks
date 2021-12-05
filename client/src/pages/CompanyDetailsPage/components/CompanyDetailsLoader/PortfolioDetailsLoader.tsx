import React, { FC, ReactNode, useContext, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Spin } from "antd";
import { CompaniesContext } from "contexts/companies";
import { PortfoliosContext } from "contexts/portfolios";

export interface IParams {
  id: string;
}

const PortfolioDetailsLoader: FC<ReactNode> = ({ children }) => {
  const {
    isLoading,
    portfolio,
    getById: getPortfolio
  } = useContext(PortfoliosContext);

  const { getAll: getCompanies } = useContext(CompaniesContext);
  const params = useParams<IParams>();
  const { id } = params;
  console.log("ID: ", id);

  useEffect(() => {
    if (id) {
      getPortfolio(+id);
    }
  }, [getPortfolio, id]);

  useEffect(() => {
    const getAll = async () => {
      getCompanies();
    };
    getAll();
  }, [getCompanies]);

  if (isLoading || !portfolio) {
    return <Spin />;
  }

  return <>{children}</>;
};

export default PortfolioDetailsLoader;
