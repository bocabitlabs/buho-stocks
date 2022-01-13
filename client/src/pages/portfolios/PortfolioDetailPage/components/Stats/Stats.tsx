/* eslint-disable react/jsx-props-no-spreading */
import React, { ReactElement, useEffect, useState } from "react";
import { ArrowDownOutlined, ArrowUpOutlined } from "@ant-design/icons";
import { Col, Form, Row, Select, Spin, Statistic, Typography } from "antd";
import useFetch from "use-http";

interface Props {
  id: string | undefined;
}

export default function Stats({ id }: Props): ReactElement {
  const [selectedYear, setSelectedYear] = useState<any | null>("all");
  const [years, setYears] = useState<any[]>([]);
  const [firstYear, setFirstYear] = useState<any | null>(null);
  const [stats, setStats] = useState<any | null>(null);
  const {
    response,
    get,
    loading: loadingStats,
  } = useFetch(`stats/portfolio/${id}`);
  const { response: yearResponse, get: getFirstYear } = useFetch(
    `stats/portfolio-first-year/${id}`,
  );
  const handleYearChange = (value: string) => {
    setSelectedYear(value);
  };

  useEffect(() => {
    async function loadInitialStats() {
      const initialData = await getFirstYear("/");
      if (yearResponse.ok) {
        setFirstYear(initialData);
        const currentYear = new Date().getFullYear();
        const newYears = [];
        for (let index = +currentYear; index >= +firstYear; index -= 1) {
          newYears.push(index);
        }
        setYears(newYears);
      }
    }
    loadInitialStats();
  }, [yearResponse.ok, getFirstYear, firstYear]);

  useEffect(() => {
    async function loadInitialStats() {
      const initialData = await get(`/${selectedYear}`);
      if (response.ok) {
        setStats(initialData);
      }
    }
    loadInitialStats();
  }, [response.ok, get, selectedYear]);

  if (!stats) {
    return <Spin />;
  }
  const columnProps = {
    xs: { span: 12 },
    lg: { span: 6 },
  };

  return (
    <div style={{ marginTop: 16 }}>
      <Form layout="inline">
        <Select
          defaultValue={selectedYear}
          style={{ width: 120 }}
          onChange={handleYearChange}
          disabled={loadingStats}
          loading={loadingStats}
        >
          <Select.Option value="all">All</Select.Option>
          {years.map((yearItem: any) => (
            <Select.Option key={yearItem} value={yearItem}>
              {yearItem}
            </Select.Option>
          ))}
        </Select>
      </Form>
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
            title="Portfolio Value"
            value={stats?.portfolioValue}
            valueStyle={{
              color: stats?.portfolioValueIsDown ? "#cf1322" : "",
            }}
            prefix={
              stats?.portfolioValueIsDown ? (
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
            title="Return"
            value={stats?.returnValue}
            precision={2}
            valueStyle={{
              color: stats?.returnValue < 0 ? "#cf1322" : "",
            }}
            prefix={
              stats?.returnValue < 0 ? (
                <ArrowDownOutlined />
              ) : (
                <ArrowUpOutlined />
              )
            }
            suffix={stats?.portfolioCurrency}
          />
          <Typography.Text
            type={stats?.returnPercent < 0 ? "danger" : "success"}
          >
            {stats?.returnPercent.toFixed(2)}%
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
            {stats?.returnWithDividendsPercent.toFixed(2)}%
          </Typography.Text>
        </Col>
      </Row>
    </div>
  );
}
