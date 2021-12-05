import React, { FC, ReactNode, useContext, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Spin } from "antd";
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

  const params = useParams<IParams>();
  const { id } = params;
  console.log("ID: ", id);

  useEffect(() => {
    if (id) {
      getPortfolio(+id);
    }
  }, [getPortfolio, id]);

  if (isLoading || !portfolio) {
    return <Spin />;
  }

  return <>{children}</>;
};

export default PortfolioDetailsLoader;
