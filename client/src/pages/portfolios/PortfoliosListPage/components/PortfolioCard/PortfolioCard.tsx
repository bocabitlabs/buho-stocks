import React, { ReactElement } from "react";
import { useTranslation } from "react-i18next";
import { ArrowDownOutlined, ArrowUpOutlined } from "@ant-design/icons";
import { Card, Statistic, Typography } from "antd";
import CountryFlag from "components/CountryFlag/CountryFlag";
import { IPortfolio } from "types/portfolio";

interface Props {
  portfolio: IPortfolio;
}

export default function PortfolioCard({ portfolio }: Props): ReactElement {
  const { t } = useTranslation();
  let stats = portfolio.stats.filter((stat: any) => stat.year === 9999);
  if (stats.length === 1) {
    [stats] = stats;
  }
  return (
    <Card
      title={portfolio.name}
      hoverable
      extra={<CountryFlag code={portfolio.baseCurrency.code} />}
    >
      {portfolio.companies.length} {t("companies")}
      <Statistic
        value={stats?.portfolioValue}
        precision={2}
        suffix={stats?.portfolioCurrency}
      />
      <Typography.Text
        type={stats?.returnWithDividends < 0 ? "danger" : "success"}
      >
        {stats?.returnWithDividends
          ? Number(stats.returnWithDividends).toFixed(2)
          : ""}{" "}
        {stats?.portfolioCurrency}
      </Typography.Text>{" "}
      {" / "}
      <Typography.Text
        type={stats?.returnWithDividendsPercent < 0 ? "danger" : "success"}
      >
        {Number(stats?.portfolioValue) <
        Number(stats?.accumulatedInvestment) ? (
          <ArrowDownOutlined />
        ) : (
          <ArrowUpOutlined />
        )}{" "}
        {stats?.returnWithDividendsPercent
          ? Number(stats?.returnWithDividendsPercent).toFixed(2)
          : ""}
        %
      </Typography.Text>
    </Card>
  );
}
