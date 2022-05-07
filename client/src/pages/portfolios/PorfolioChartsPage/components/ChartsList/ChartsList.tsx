import React, { ReactElement } from "react";
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

export default function ChartsList(): ReactElement {
  // States
  const rowStyle = {
    marginTop: 20,
  };

  return (
    <>
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
          <ChartValueByCompany />
        </Col>
      </Row>
      <Row style={rowStyle}>
        <Col xs={{ span: 22, offset: 1 }} md={{ span: 16, offset: 4 }}>
          <ChartDividendsByCompany />
        </Col>
      </Row>
      <Row style={rowStyle}>
        <Col xs={{ span: 22, offset: 1 }} md={{ span: 12, offset: 0 }}>
          <ChartSectorsByCompany />
        </Col>
        <Col xs={{ span: 22, offset: 1 }} md={{ span: 12, offset: 0 }}>
          <ChartSuperSectorsByCompany />
        </Col>
      </Row>
      <Row style={rowStyle}>
        <Col xs={{ span: 22, offset: 1 }} md={{ span: 6, offset: 1 }}>
          <ChartCurrenciesByCompany />
        </Col>
        <Col xs={{ span: 22, offset: 1 }} md={{ span: 6, offset: 1 }}>
          <ChartBrokerByCompany />
        </Col>
        <Col xs={{ span: 22, offset: 1 }} md={{ span: 6, offset: 1 }}>
          <ChartMarketByCompany />
        </Col>
      </Row>
    </>
  );
}
