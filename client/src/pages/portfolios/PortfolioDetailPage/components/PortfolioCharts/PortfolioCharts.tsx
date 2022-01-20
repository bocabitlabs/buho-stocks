import React from "react";
import { useParams } from "react-router-dom";
import { Col, Row, Spin } from "antd";
import { Chart, registerables } from "chart.js";
import PortfolioDividendsChart from "../PortfolioDividendsChart/PortfolioDividendsChart";
import PortfolioReturnsChart from "../PortfolioReturnsChart/PortfolioReturnsChart";
import { usePortfolioAllYearStats } from "hooks/use-stats/use-portfolio-stats";

Chart.register(...registerables);

export default function Charts() {
  const { id } = useParams();
  const { data: stats, isFetching: loading } = usePortfolioAllYearStats(
    +id!,
    undefined,
  );

  if (loading) {
    return <Spin />;
  }

  return (
    <Row style={{ marginTop: 16, marginBottom: 16 }}>
      <Col xs={{ span: 24 }} md={{ span: 12 }}>
        <PortfolioReturnsChart stats={stats} />
      </Col>
      <Col xs={{ span: 24 }} md={{ span: 12 }}>
        <PortfolioDividendsChart stats={stats} />
      </Col>
    </Row>
  );
}
