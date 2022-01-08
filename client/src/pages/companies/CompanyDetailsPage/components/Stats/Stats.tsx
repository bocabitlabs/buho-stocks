import React, { ReactElement, useCallback, useEffect, useState } from "react";
import {
  ArrowDownOutlined,
  ArrowUpOutlined,
  // ArrowUpOutlined,
  SyncOutlined,
} from "@ant-design/icons";
import {
  Button,
  Col,
  Form,
  Row,
  Select,
  Spin,
  Statistic,
  Typography,
} from "antd";
import useFetch from "use-http";

interface Props {
  companyId: string | undefined;
}

export default function Stats({ companyId }: Props): ReactElement {
  const [stats, setStats] = useState<any | null>(null);
  const [stockPrice, setStockPrice] = useState<any | null>(null);
  const [firstYear, setFirstYear] = useState<any | null>(null);
  const [selectedYear, setSelectedYear] = useState<any | null>("all");
  const [years, setYears] = useState<any[]>([]);
  const {
    response,
    get,
    loading: loadingStats,
  } = useFetch(`stats/${companyId}`);
  const { response: yearResponse, get: getFirstYear } = useFetch(
    `stats/company-first-year/${companyId}`,
  );
  const {
    loading: loadingPrice,
    response: responsePrice,
    get: getPrice,
  } = useFetch(`companies/${companyId}/stock-prices`);

  const getStockPrice = useCallback(async () => {
    let tempYear = selectedYear;
    if (selectedYear === "all") {
      tempYear = (new Date().getFullYear() - 1).toString();
    }

    const result = await getPrice(`${tempYear}/last/`);
    if (responsePrice.ok) {
      setStockPrice(result);
    }
  }, [getPrice, responsePrice.ok, selectedYear]);

  const handleYearChange = (value: string) => {
    setSelectedYear(value);
  };

  useEffect(() => {
    async function loadInitialStats() {
      const initialData = await get(`/${selectedYear}`);
      if (response.ok) {
        setStats(initialData);
      }
      if (response.ok) {
        setStats(initialData);
        setStockPrice({
          price: initialData.stockPriceValue,
          priceCurrency: initialData.stockPriceCurrency,
          transactionDate: initialData.stockPriceTransactionDate,
        });
      }
    }
    loadInitialStats();
  }, [response.ok, get, companyId, selectedYear]);

  useEffect(() => {
    async function loadInitialStats() {
      const initialData = await getFirstYear("/");
      if (yearResponse.ok) {
        setFirstYear(initialData);
        const currentYear = new Date().getFullYear();
        const newYears = [];
        if (firstYear != null) {
          for (let index = +currentYear; index >= +firstYear; index -= 1) {
            newYears.push(index);
          }
          setYears(newYears);
        }
      }
    }
    loadInitialStats();
  }, [yearResponse.ok, getFirstYear, firstYear]);

  if (!stats) {
    return <Spin />;
  }
  return (
    <div>
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
      <Row gutter={24}>
        <Col span={6}>
          <Statistic title="Shares" value={stats?.sharesCount} />
        </Col>
        <Col span={6}>
          <Statistic
            title="Invested"
            value={stats?.invested}
            precision={2}
            suffix={stats?.portfolioCurrency}
          />
        </Col>
        <Col span={6}>
          <Statistic
            title="Accum. Investment"
            value={stats?.accumulatedInvestment}
            precision={2}
            suffix={stats?.portfolioCurrency}
          />
        </Col>
        <Col span={6}>
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
        <Col span={6}>
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
        <Col span={6}>
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
            {stats?.returnPercent}%
          </Typography.Text>
        </Col>
        <Col span={6}>
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
            {stats?.returnWithDividendsPercent}%
          </Typography.Text>
        </Col>
        <Col span={6}>
          <Statistic
            title="Last stock price"
            value={stockPrice?.price}
            precision={2}
            suffix={stockPrice?.priceCurrency}
          />
          <Typography.Text type="secondary">
            {stockPrice?.transactionDate}
          </Typography.Text>
          <Button type="text" loading={loadingPrice} onClick={getStockPrice}>
            <SyncOutlined />
          </Button>
        </Col>
      </Row>
    </div>
  );
}
