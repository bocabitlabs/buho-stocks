/* eslint-disable react/jsx-props-no-spreading */
import React, { ReactElement } from "react";
import { ArrowDownOutlined, ArrowUpOutlined } from "@ant-design/icons";
import { Col, Row, Statistic, Typography } from "antd";

interface Props {
  stats: any;
}

export default function StatsContent({ stats }: Props): ReactElement {
  const columnProps = {
    xs: { span: 12 },
    lg: { span: 6 },
  };

  return (
    <Row gutter={24} style={{ marginTop: 16 }}>
      <Col {...columnProps}>
        <Statistic
          title="Invested"
          value={stats?.invested}
          precision={2}
          suffix={stats?.portfolioCurrency}
        />
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
          title="Portfolio Value"
          value={stats?.portfolioValue}
          valueStyle={{
            color:
              stats?.portfolioValue < stats?.accumulatedInvestment
                ? "#cf1322"
                : "",
          }}
          prefix={
            stats?.portfolioValue < stats?.accumulatedInvestment ? (
              <ArrowDownOutlined />
            ) : (
              <ArrowUpOutlined />
            )
          }
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
      </Col>
      <Col {...columnProps}>
        <Statistic
          title="Accum. Dividends"
          value={stats?.accumulatedDividends}
          precision={2}
          suffix={stats?.portfolioCurrency}
        />
      </Col>
      <Col {...columnProps}>
        <Statistic
          title="Dividends yield"
          value={stats?.dividendsYield}
          precision={2}
          suffix="%"
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
          prefix={
            stats?.returnValue < 0 ? <ArrowDownOutlined /> : <ArrowUpOutlined />
          }
          suffix={stats?.portfolioCurrency}
        />
        <Typography.Text type={stats?.returnPercent < 0 ? "danger" : "success"}>
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
          prefix={
            stats?.returnWithDividends < 0 ? (
              <ArrowDownOutlined />
            ) : (
              <ArrowUpOutlined />
            )
          }
          suffix={stats?.portfolioCurrency}
        />
        <Typography.Text
          type={stats?.returnWithDividendsPercent < 0 ? "danger" : "success"}
        >
          {stats?.returnWithDividendsPercent
            ? Number(stats.returnWithDividendsPercent).toFixed(2)
            : ""}
          %
        </Typography.Text>
      </Col>
    </Row>
  );
}
