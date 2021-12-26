import React from "react";
import { Col, Row } from "antd";
import MarketsAddPageHeader from "./components/MarketsAddPageHeader/MarketsAddPageHeader";
import MarketAddEditForm from "components/MarketAddEditForm/MarketAddEditForm";

export default function MarketsAddPage() {
  return (
    <MarketsAddPageHeader>
      <Row>
        <Col>
          <MarketAddEditForm />
        </Col>
        <Col />
      </Row>
    </MarketsAddPageHeader>
  );
}
