import React from "react";
import { Col, Row, Spin } from "antd";

interface Props {
  style?: any;
}

export default function LoadingSpin({ style }: Props) {
  return (
    <Row align="middle" justify="center">
      <Col span={6} offset={5} style={style}>
        <Spin tip="Loading..." />
      </Col>
    </Row>
  );
}
LoadingSpin.defaultProps = {
  style: {},
};
