import PageHeader from "antd/lib/page-header";
import React, { ReactElement, useContext, useEffect } from "react";

import { PortfoliosContext } from "contexts/portfolios";
import {
  HomeOutlined,
} from "@ant-design/icons";
import { breadcrumbItemRender } from "utils/headers-utils";
import CountryFlag from "components/CountryFlag/CountryFlag";

interface Props {
  portfolioId: string;
}

export default function PortfolioGraphsHeader({
  portfolioId
}: Props): ReactElement | null {
  const { portfolio, getById } = useContext(PortfoliosContext);

  useEffect(() => {
    if (portfolioId === undefined || portfolioId === null) {
      console.error("portfolioId is undefined. This will lead to errors");
    }
    getById(portfolioId);
  }, [portfolioId, getById]);

  const routes = [
    {
      path: "/home",
      name: "home",
      breadcrumbName: "Home",
      icon: <HomeOutlined />,
      iconOnly: true
    },
    {
      path: `/portfolios/${portfolioId}`,
      name: "portfolio-details",
      breadcrumbName: portfolio ? portfolio.name : ""
    },
    {
      path: `/portfolios/${portfolioId}/charts`,
      name: "portfolio-charts",
      breadcrumbName: "Charts"
    }
  ];

  if (portfolio === null) {
    return null;
  }

  return (
    <PageHeader
      title={`${portfolio.name} charts`}
      subTitle={portfolio.description}
      breadcrumb={{
        routes,
        itemRender: breadcrumbItemRender
      }}
      tags={[<CountryFlag code={portfolio.currencyCountryCode} />]}
    />
  );
}
