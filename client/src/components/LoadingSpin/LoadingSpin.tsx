import React from "react";
import { useTranslation } from "react-i18next";
import { Col, Row, Spin } from "antd";

interface Props {
  style?: any;
  text?: string;
}

export default function LoadingSpin({ style, text = "Loading..." }: Props) {
  const { t } = useTranslation();

  return (
    <Row align="middle" justify="center">
      <Col span={6} offset={5} style={style}>
        <Spin tip={t(text)} />
      </Col>
    </Row>
  );
}
LoadingSpin.defaultProps = {
  style: {},
  text: "Loading...",
};
