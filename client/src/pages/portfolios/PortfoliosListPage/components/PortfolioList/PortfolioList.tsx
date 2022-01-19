import React, { ReactElement } from "react";
import { Link } from "react-router-dom";
import { List, Spin } from "antd";
import PortfolioCard from "../PortfolioCard/PortfolioCard";
import { usePortfolios } from "hooks/use-portfolios/use-portfolios";
import { IPortfolio } from "types/portfolio";

export default function PortfolioList(): ReactElement {
  const { isFetching, data: portfolios } = usePortfolios();

  if (isFetching) {
    return <Spin />;
  }

  return (
    <List
      grid={{
        gutter: 16,
        xs: 1,
        sm: 2,
        md: 3,
        lg: 3,
        xl: 4,
        xxl: 6,
      }}
      dataSource={portfolios}
      renderItem={(item) => (
        <Link to={`/app/portfolios/${(item as IPortfolio).id}`}>
          <List.Item>
            <PortfolioCard portfolio={item as IPortfolio} />
          </List.Item>
        </Link>
      )}
    />
  );
}
