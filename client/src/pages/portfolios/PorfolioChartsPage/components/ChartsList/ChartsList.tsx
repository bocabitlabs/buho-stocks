import React, { ReactElement, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Col, Row } from "antd";
import ChartBrokerByCompany from "./components/ChartBrokerByCompany/ChartBrokerByCompany";
import ChartCurrenciesByCompany from "./components/ChartCurrenciesByCompany/ChartCurrenciesByCompany";
import ChartDividendsByCompany from "./components/ChartDividendsByCompany/ChartDividendsByCompany";
import ChartInvestedByCompany from "./components/ChartInvestedByCompany/ChartInvestedByCompany";
import ChartInvestedByCompanyYearly from "./components/ChartInvestedByCompanyYearly/ChartInvestedByCompanyYearly";
import ChartMarketByCompany from "./components/ChartMarketByCompany/ChartMarketByCompany";
import ChartPortfolioDividendsPerMonth from "./components/ChartPortfolioDividendsPerMonth/ChartPortfolioDividendsPerMonth";
import ChartSectorsByCompany from "./components/ChartSectorsByCompany/ChartSectorsByCompany";
import ChartSuperSectorsByCompany from "./components/ChartSuperSectorsByCompany/ChartSuperSectorsByCompany";
import ChartValueByCompany from "./components/ChartValueByCompany/ChartValueByCompany";
import ChartPortfolioDividends from "components/ChartPortfolioDividends/ChartPortfolioDividends";
import ChartPortfolioReturns from "components/ChartPortfolioReturns/ChartPortfolioReturns";
import { usePortfolioYearStats } from "hooks/use-stats/use-portfolio-stats";

export default function ChartsList(): ReactElement {
  // Params
  const { id } = useParams();
  // States
  const [filteredChartData, setFilteredChartData] = React.useState<any>(null);
  // Hooks
  const { data } = usePortfolioYearStats(+id!, "all", "company");
  const rowStyle = {
    marginTop: 20,
  };

  useEffect(() => {
    if (data) {
      const tempData: any = data.filter((item: any) => {
        return item.sharesCount > 0;
      });

      setFilteredChartData(tempData);
    }
  }, [data]);

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

      <Row style={rowStyle}>
        <Col xs={{ span: 22, offset: 1 }} md={{ span: 24, offset: 0 }}>
          <ChartPortfolioDividendsPerMonth />
        </Col>
      </Row>
      {filteredChartData && (
        <>
          <Row style={rowStyle}>
            <Col xs={{ span: 22, offset: 1 }} md={{ span: 24, offset: 0 }}>
              <ChartInvestedByCompany />
            </Col>
          </Row>
          <Row style={rowStyle}>
            <Col xs={{ span: 22, offset: 1 }} md={{ span: 24, offset: 0 }}>
              <ChartInvestedByCompanyYearly />
            </Col>
          </Row>
          <Row style={rowStyle}>
            <Col xs={{ span: 22, offset: 1 }} md={{ span: 24, offset: 0 }}>
              <ChartValueByCompany statsData={filteredChartData} />
            </Col>
          </Row>
          <Row style={rowStyle}>
            <Col xs={{ span: 22, offset: 1 }} md={{ span: 16, offset: 4 }}>
              <ChartDividendsByCompany statsData={filteredChartData} />
            </Col>
          </Row>
          <Row style={rowStyle}>
            <Col xs={{ span: 22, offset: 1 }} md={{ span: 12, offset: 0 }}>
              <ChartSectorsByCompany statsData={filteredChartData} />
            </Col>
            <Col xs={{ span: 22, offset: 1 }} md={{ span: 12, offset: 0 }}>
              <ChartSuperSectorsByCompany statsData={filteredChartData} />
            </Col>
          </Row>
          <Row style={rowStyle}>
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
        </>
      )}
    </div>
  );
}
