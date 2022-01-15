/* eslint-disable react/jsx-props-no-spreading */
import React, { ReactElement } from "react";
import { ArrowDownOutlined, ArrowUpOutlined } from "@ant-design/icons";
import { Col, Row, Statistic, Typography } from "antd";

interface Props {
  stats: any;
  stockPrice: any;
}

export default function StatsContent({
  stats,
  stockPrice,
}: Props): ReactElement {
  const columnProps = {
    xs: { span: 12 },
    md: { span: 6 },
    style: { marginBottom: "16px" },
  };

  return (
    <Row gutter={24}>
      <Col {...columnProps}>
        <Statistic
          title="Invested"
          value={stats?.invested}
          precision={2}
          suffix={stats?.portfolioCurrency}
        />
        <Typography.Text type="secondary">
          {stats?.sharesCount} shares
        </Typography.Text>
      </Col>
      <Col {...columnProps}>
        <Statistic
          title="Accum. Investment"
          value={stats?.accumulatedInvestment}
          precision={2}
          suffix={stats?.portfolioCurrency}
        />
      </Col>
      <Col {...columnProps}>
        <Statistic
          title="Dividends"
          value={stats?.dividends}
          precision={2}
          suffix={stats?.portfolioCurrency}
        />
        <Typography.Text type="secondary">
          Accum. {stats?.accumulatedDividends} {stats?.portfolioCurrency}
        </Typography.Text>
      </Col>
      <Col {...columnProps}>
        <Statistic
          title="Dividends Yield"
          value={stats?.dividendsYield ? stats.dividendsYield : 0}
          precision={2}
          suffix="%"
        />
      </Col>
      <Col {...columnProps}>
        <Statistic
          title="Portfolio Value"
          value={stats?.portfolioValue}
          valueStyle={{
            color: stats?.portfolioValueIsDown ? "#cf1322" : "",
          }}
          precision={2}
          suffix={stats?.portfolioCurrency}
        />
      </Col>
      <Col {...columnProps}>
        <Statistic
          title="Return"
          value={stats?.returnValue}
          precision={2}
          valueStyle={{
            color: stats?.returnValue < 0 ? "#cf1322" : "",
          }}
          suffix={stats?.portfolioCurrency}
        />
        <Typography.Text type={stats?.returnPercent < 0 ? "danger" : "success"}>
          {stats?.returnValue < 0 ? <ArrowDownOutlined /> : <ArrowUpOutlined />}
          {stats?.returnPercent ? Number(stats.returnPercent).toFixed(2) : ""}%
        </Typography.Text>
      </Col>
      <Col {...columnProps}>
        <Statistic
          title="Return with Div."
          value={stats?.returnWithDividends}
          precision={2}
          valueStyle={{
            color: stats?.returnWithDividends < 0 ? "#cf1322" : "",
          }}
          suffix={stats?.portfolioCurrency}
        />
        <Typography.Text
          type={stats?.returnWithDividendsPercent < 0 ? "danger" : "success"}
        >
          {stats?.returnWithDividends < 0 ? (
            <ArrowDownOutlined />
          ) : (
            <ArrowUpOutlined />
          )}
          {stats?.returnWithDividendsPercent
            ? Number(stats.returnWithDividendsPercent).toFixed(2)
            : ""}
          %
        </Typography.Text>
      </Col>
      <Col {...columnProps}>
        <Statistic
          title="Last stock price"
          value={stockPrice?.price}
          precision={2}
          suffix={stockPrice?.priceCurrency}
        />
        <Typography.Text type="secondary">
          {stockPrice?.transactionDate}
        </Typography.Text>
      </Col>
    </Row>
  );
}
