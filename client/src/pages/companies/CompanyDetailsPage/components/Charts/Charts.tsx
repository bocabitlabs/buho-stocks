import React from "react";
import { Col, Row } from "antd";
import { Chart, registerables } from "chart.js";
import DividendsChart from "../DividendsChart/DividendsChart";
import ReturnsChart from "../ReturnsChart/ReturnsChart";

Chart.register(...registerables);

interface Props {
  stats: any[];
  portfolioCurrency: string;
}

export default function Charts({ stats, portfolioCurrency }: Props) {
  return (
    <Row style={{ marginTop: 16, marginBottom: 16 }}>
      <Col xs={{ span: 24 }} md={{ span: 12 }}>
        <ReturnsChart stats={stats} />
      </Col>
      <Col xs={{ span: 24 }} md={{ span: 12 }}>
        <DividendsChart stats={stats} portfolioCurrency={portfolioCurrency} />
      </Col>
    </Row>
  );
}
