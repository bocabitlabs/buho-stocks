import React, { ReactElement, useContext, useEffect } from "react";
import { Link } from "react-router-dom";
import { List, Spin } from "antd";
import PortfolioCard from "../PortfolioCard/PortfolioCard";
import { PortfoliosContext } from "contexts/portfolios";

export default function PortfolioList(): ReactElement {
  const {
    isLoading,
    portfolios,
    getAll: getPortfolios
  } = useContext(PortfoliosContext);

  useEffect(() => {
    const getAllPortfolios = async () => {
      getPortfolios();
    };
    getAllPortfolios();
  }, [getPortfolios]);

  if (isLoading) {
    return <Spin />;
  }

  return (
    <List
      grid={{ gutter: 16, column: 4 }}
      dataSource={portfolios}
      renderItem={(item) => (
        <Link to={`/app/portfolios/${item.id}`}>
          <List.Item>
            <PortfolioCard portfolio={item} />
          </List.Item>
        </Link>
      )}
    />
  );
}
