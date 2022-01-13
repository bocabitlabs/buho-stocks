import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import { Col, Row, Spin } from "antd";
import { Chart, registerables } from "chart.js";
import useFetch from "use-http";
import PortfolioDividendsChart from "../PortfolioDividendsChart/PortfolioDividendsChart";
import PortfolioReturnsChart from "../PortfolioReturnsChart/PortfolioReturnsChart";

Chart.register(...registerables);

export default function Charts() {
  const { id } = useParams();
  const [stats, setStats] = React.useState([]);
  const { get, response, loading } = useFetch("stats/portfolio");

  useEffect(() => {
    async function loadInitialStats() {
      const initialData = await get(`${id}/all-years/`);
      if (response.ok) {
        setStats(initialData);
      }
    }
    loadInitialStats();
  }, [response.ok, get, id]);

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
