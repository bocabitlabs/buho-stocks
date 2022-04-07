import React from "react";
import { Col, Row } from "antd";
import ChartPortfolioDividends from "components/ChartPortfolioDividends/ChartPortfolioDividends";
import ChartPortfolioReturns from "components/ChartPortfolioReturns/ChartPortfolioReturns";

export default function Charts() {
  return (
    <Row style={{ marginTop: 16, marginBottom: 16 }}>
      <Col xs={{ span: 24 }} md={{ span: 12 }}>
        <ChartPortfolioReturns />
      </Col>
      <Col xs={{ span: 24 }} md={{ span: 12 }}>
        <ChartPortfolioDividends />
      </Col>
    </Row>
  );
}
