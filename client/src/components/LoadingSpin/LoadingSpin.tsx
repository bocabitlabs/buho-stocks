import React from "react";
import { useTranslation } from "react-i18next";
import { Col, Row, Spin } from "antd";

interface Props {
  style?: any;
}

export default function LoadingSpin({ style }: Props) {
  const { t } = useTranslation();

  return (
    <Row align="middle" justify="center">
      <Col span={6} offset={5} style={style}>
        <Spin tip={`${t("Loading...")}`} />
      </Col>
    </Row>
  );
}
LoadingSpin.defaultProps = {
  style: {},
};
