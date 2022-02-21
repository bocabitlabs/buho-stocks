import React from "react";
import { Col, Row, Spin } from "antd";

export default function LoadingSpin() {
  return (
    <Row align="middle" justify="center">
      <Col span={6} offset={5}>
        <Spin tip="Loading..." />
      </Col>
    </Row>
  );
}
