import React, { ReactElement, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { ArrowDownOutlined, ArrowUpOutlined } from "@ant-design/icons";
import { Card, Spin, Statistic, Typography } from "antd";
import useFetch from "use-http";
import CountryFlag from "components/CountryFlag/CountryFlag";
import { IPortfolio } from "types/portfolio";

interface Props {
  portfolio: IPortfolio;
}

export default function PortfolioCardContent({
  portfolio,
}: Props): ReactElement | null {
  const { t } = useTranslation();
  const [stats, setStats] = useState<any | null>(null);
  const {
    response,
    get,
    loading: loadingStats,
  } = useFetch(`stats/portfolio/${portfolio.id}`);

  useEffect(() => {
    async function loadInitialStats() {
      const initialData = await get(`/all/`);
      if (response.ok) {
        setStats(initialData);
      }
    }
    loadInitialStats();
  }, [response.ok, get]);

  return (
    <Card
      title={portfolio.name}
      hoverable
      extra={<CountryFlag code={portfolio.baseCurrency.code} />}
    >
      {portfolio.companies.length} {t("companies")}
      {loadingStats ? (
        <Spin />
      ) : (
        <Statistic
          value={stats?.portfolioValue}
          precision={2}
          suffix={stats?.portfolioCurrency}
        />
      )}
      <Typography.Text
        type={stats?.returnWithDividends < 0 ? "danger" : "success"}
      >
        {stats?.portfolioValueIsDown ? (
          <ArrowDownOutlined />
        ) : (
          <ArrowUpOutlined />
        )}
        {stats?.returnWithDividends.toFixed(2)} {stats?.portfolioCurrency}
      </Typography.Text>{" "}
      {" / "}
      <Typography.Text
        type={stats?.returnWithDividendsPercent < 0 ? "danger" : "success"}
      >
        {stats?.returnWithDividendsPercent.toFixed(2)}%
      </Typography.Text>
    </Card>
  );
}
