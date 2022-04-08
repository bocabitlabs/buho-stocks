import React from "react";
import { useTranslation } from "react-i18next";
import { Col, Row } from "antd";
import DividendsChart from "../DividendsChart/DividendsChart";
import ReturnsChart from "../ReturnsChart/ReturnsChart";
import LoadingSpin from "components/LoadingSpin/LoadingSpin";

interface Props {
  stats: any[];
  portfolioCurrency: string;
}

export default function Charts({ stats, portfolioCurrency }: Props) {
  const { t } = useTranslation();
  return (
    <React.Suspense
      fallback={
        <LoadingSpin
          text={`${t("Loading charts...")}`}
          style={{ marginTop: 20 }}
        />
      }
    >
      <Row style={{ marginTop: 16, marginBottom: 16 }}>
        <Col xs={{ span: 24 }} md={{ span: 12 }}>
          <ReturnsChart stats={stats} />
        </Col>
        <Col xs={{ span: 24 }} md={{ span: 12 }}>
          <DividendsChart stats={stats} portfolioCurrency={portfolioCurrency} />
        </Col>
      </Row>
    </React.Suspense>
  );
}
