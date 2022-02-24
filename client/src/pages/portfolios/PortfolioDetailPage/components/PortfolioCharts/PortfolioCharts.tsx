import React from "react";
import { useParams } from "react-router-dom";
import { Col, Row } from "antd";
import { Chart, registerables } from "chart.js";
import PortfolioDividendsChart from "../PortfolioDividendsChart/PortfolioDividendsChart";
import PortfolioReturnsChart from "../PortfolioReturnsChart/PortfolioReturnsChart";
import LoadingSpin from "components/LoadingSpin/LoadingSpin";
import { usePortfolioAllYearStats } from "hooks/use-stats/use-portfolio-stats";

Chart.register(...registerables);

export default function Charts() {
  const { id } = useParams();
  const { data: stats, isFetching } = usePortfolioAllYearStats(+id!, undefined);

  if (isFetching) {
    return <LoadingSpin />;
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
