import React, { ReactElement, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Col, Form, Row, Select } from "antd";
import ChartBrokerByCompany from "./components/ChartBrokerByCompany/ChartBrokerByCompany";
import ChartCurrenciesByCompany from "./components/ChartCurrenciesByCompany/ChartCurrenciesByCompany";
import ChartDividendsByCompany from "./components/ChartDividendsByCompany/ChartDividendsByCompany";
import ChartInvestedByCompany from "./components/ChartInvestedByCompany/ChartInvestedByCompany";
import ChartInvestedByCompanyYearly from "./components/ChartInvestedByCompanyYearly/ChartInvestedByCompanyYearly";
import ChartMarketByCompany from "./components/ChartMarketByCompany/ChartMarketByCompany";
import ChartPortfolioDividends from "./components/ChartPortfolioDividends/ChartPortfolioDividends";
import ChartPortfolioDividendsPerMonth from "./components/ChartPortfolioDividendsPerMonth/ChartPortfolioDividendsPerMonth";
import ChartPortfolioReturns from "./components/ChartPortfolioReturns/ChartPortfolioReturns";
import ChartSectorsByCompany from "./components/ChartSectorsByCompany/ChartSectorsByCompany";
import ChartSuperSectorsByCompany from "./components/ChartSuperSectorsByCompany copy/ChartSuperSectorsByCompany";
import ChartValueByCompany from "./components/ChartValueByCompany/ChartValueByCompany";
import { usePortfolioYearStats } from "hooks/use-stats/use-portfolio-stats";

interface Props {
  firstYear: number | null;
}

export default function ChartsList({ firstYear }: Props): ReactElement {
  // Params
  const { id } = useParams();
  // States
  const [filteredChartData, setFilteredChartData] = React.useState<any>(null);
  const [selectedYear, setSelectedYear] = React.useState<any | null>("all");
  const [years, setYears] = React.useState<any[]>([]);
  // Hooks
  usePortfolioYearStats(+id!, selectedYear, "company", {
    onSuccess: (data: any) => {
      const tempData: any = data.filter((item: any) => {
        return item.sharesCount > 0;
      });

      setFilteredChartData(tempData);
    },
  });

  const handleYearChange = (value: string) => {
    setSelectedYear(value);
  };

  useEffect(() => {
    async function loadFirstYear() {
      const currentYear = new Date().getFullYear();
      const newYears = [];
      if (firstYear != null) {
        for (let index = +currentYear; index >= +firstYear; index -= 1) {
          newYears.push(index);
        }
        setYears(newYears);
      }
    }
    loadFirstYear();
  }, [firstYear]);

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
      {filteredChartData && (
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
            <ChartInvestedByCompany statsData={filteredChartData} />
          </Row>
          <Row>
            <ChartInvestedByCompanyYearly statsData={filteredChartData} />
          </Row>
          <Row>
            <ChartValueByCompany statsData={filteredChartData} />
          </Row>
          <Row>
            <Col xs={{ span: 22, offset: 1 }} md={{ span: 16, offset: 4 }}>
              <ChartDividendsByCompany statsData={filteredChartData} />
            </Col>
          </Row>
          <Row>
            <Col xs={{ span: 22, offset: 1 }} md={{ span: 12, offset: 0 }}>
              <ChartSectorsByCompany statsData={filteredChartData} />
            </Col>
            <Col xs={{ span: 22, offset: 1 }} md={{ span: 12, offset: 0 }}>
              <ChartSuperSectorsByCompany statsData={filteredChartData} />
            </Col>
          </Row>
          <Row>
            <Col xs={{ span: 22, offset: 1 }} md={{ span: 6, offset: 1 }}>
              <ChartCurrenciesByCompany statsData={filteredChartData} />
            </Col>
            <Col xs={{ span: 22, offset: 1 }} md={{ span: 6, offset: 1 }}>
              <ChartBrokerByCompany statsData={filteredChartData} />
            </Col>
            <Col xs={{ span: 22, offset: 1 }} md={{ span: 6, offset: 1 }}>
              <ChartMarketByCompany statsData={filteredChartData} />
            </Col>
          </Row>
        </div>
      )}
    </div>
  );
}
