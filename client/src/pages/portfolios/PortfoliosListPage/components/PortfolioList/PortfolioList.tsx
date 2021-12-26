import React, { ReactElement, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { List, Spin } from "antd";
import useFetch from "use-http";
import PortfolioCard from "../PortfolioCard/PortfolioCard";
import { IPortfolio } from "types/portfolio";

export default function PortfolioList(): ReactElement {
  const [portfolios, setPortfolios] = useState<IPortfolio[]>([]);
  const { loading, response, get } = useFetch("portfolios");

  useEffect(() => {
    const fetchPortfolios = async () => {
      const results = await get();
      if (response.ok) {
        setPortfolios(results);
      }
    };
    fetchPortfolios();
  }, [get, response]);

  if (loading) {
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
