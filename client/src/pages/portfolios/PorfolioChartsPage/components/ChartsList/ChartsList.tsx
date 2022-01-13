import React, { ReactElement, useCallback, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Col, Form, Row, Select } from "antd";
import useFetch from "use-http";
import ChartBrokerByCompany from "./components/ChartBrokerByCompany/ChartBrokerByCompany";
import ChartCurrenciesByCompany from "./components/ChartCurrenciesByCompany/ChartCurrenciesByCompany";
import ChartDividendsByCompany from "./components/ChartDividendsByCompany/ChartDividendsByCompany";
import ChartInvestedByCompany from "./components/ChartInvestedByCompany/ChartInvestedByCompany";
import ChartMarketByCompany from "./components/ChartMarketByCompany/ChartMarketByCompany";
import ChartPortfolioDividends from "./components/ChartPortfolioDividends/ChartPortfolioDividends";
import ChartPortfolioDividendsPerMonth from "./components/ChartPortfolioDividendsPerMonth/ChartPortfolioDividendsPerMonth";
import ChartPortfolioReturns from "./components/ChartPortfolioReturns/ChartPortfolioReturns";
import ChartSectorsByCompany from "./components/ChartSectorsByCompany/ChartSectorsByCompany";
import ChartSuperSectorsByCompany from "./components/ChartSuperSectorsByCompany copy/ChartSuperSectorsByCompany";
import ChartValueByCompany from "./components/ChartValueByCompany/ChartValueByCompany";

export default function ChartsList(): ReactElement {
  // Params
  const { id } = useParams();
  // States
  const [data, setData] = React.useState<any>(null);
  const [selectedYear, setSelectedYear] = React.useState<any | null>("all");
  const [years, setYears] = React.useState<any[]>([]);
  const [firstYear, setFirstYear] = React.useState<any | null>(null);
  // Hooks
  const { get: getStatsByCompany, response: responseByCompany } =
    useFetch(`stats/portfolio`);
  const { response: yearResponse, get: getFirstYear } = useFetch(
    `stats/portfolio-first-year/${id}`,
  );

  const handleYearChange = (value: string) => {
    setSelectedYear(value);
  };

  const loadInitialStats = useCallback(async () => {
    const initialData = await getStatsByCompany(
      `${id}/year/${selectedYear}/by-company/`,
    );
    if (responseByCompany.ok) {
      const filteredData: any = initialData.filter((item: any) => {
        return item.sharesCount > 0;
      });

      setData(filteredData);
    }
  }, [getStatsByCompany, id, responseByCompany.ok, selectedYear]);

  useEffect(() => {
    async function loadFirstYear() {
      const initialData = await getFirstYear("/");
      if (yearResponse.ok) {
        setFirstYear(initialData.year);
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
    loadFirstYear();
  }, [
    responseByCompany.ok,
    getStatsByCompany,
    selectedYear,
    getFirstYear,
    yearResponse.ok,
    firstYear,
    id,
    loadInitialStats,
  ]);

  useEffect(() => {
    loadInitialStats();
  }, [responseByCompany.ok, getStatsByCompany, id, loadInitialStats]);

  return (
    <div>
      <Row>
        <Col xs={{ span: 22, offset: 1 }} md={{ span: 12, offset: 0 }}>
          <ChartPortfolioReturns />
        </Col>
        <Col xs={{ span: 22, offset: 1 }} md={{ span: 12, offset: 0 }}>
          <ChartPortfolioDividends />
        </Col>
      </Row>

      <Row>
        <Col xs={{ span: 22, offset: 1 }} md={{ span: 24, offset: 0 }}>
          <ChartPortfolioDividendsPerMonth />
        </Col>
      </Row>
      {data && (
        <div>
          <div style={{ marginTop: 16 }}>
            <Form layout="inline">
              <Select
                defaultValue={selectedYear}
                style={{ width: 120 }}
                onChange={handleYearChange}
              >
                <Select.Option value="all">All</Select.Option>
                {years.map((yearItem: any) => (
                  <Select.Option key={yearItem} value={yearItem}>
                    {yearItem}
                  </Select.Option>
                ))}
              </Select>
            </Form>
          </div>
          <Row>
            <ChartInvestedByCompany statsData={data} />
          </Row>
          <Row>
            <ChartValueByCompany statsData={data} />
          </Row>
          <Row>
            <Col xs={{ span: 22, offset: 1 }} md={{ span: 16, offset: 4 }}>
              <ChartDividendsByCompany statsData={data} />
            </Col>
          </Row>
          <Row>
            <Col xs={{ span: 22, offset: 1 }} md={{ span: 12, offset: 0 }}>
              <ChartSectorsByCompany statsData={data} />
            </Col>
            <Col xs={{ span: 22, offset: 1 }} md={{ span: 12, offset: 0 }}>
              <ChartSuperSectorsByCompany statsData={data} />
            </Col>
          </Row>
          <Row>
            <Col xs={{ span: 22, offset: 1 }} md={{ span: 6, offset: 1 }}>
              <ChartCurrenciesByCompany statsData={data} />
            </Col>
            <Col xs={{ span: 22, offset: 1 }} md={{ span: 6, offset: 1 }}>
              <ChartBrokerByCompany statsData={data} />
            </Col>
            <Col xs={{ span: 22, offset: 1 }} md={{ span: 6, offset: 1 }}>
              <ChartMarketByCompany statsData={data} />
            </Col>
          </Row>
        </div>
      )}
    </div>
  );
}
