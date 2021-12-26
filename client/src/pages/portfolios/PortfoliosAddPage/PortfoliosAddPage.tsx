import React from "react";
import { Col, Row } from "antd";
import PortfoliosAddPageHeader from "./components/PortfoliosAddPageHeader/PortfoliosAddPageHeader";
import PortfolioAddEditForm from "components/PortfolioAddEditForm/PortfolioAddEditForm";

export default function PortfoliosAddPage() {
  return (
    <PortfoliosAddPageHeader>
      <Row>
        <Col>
          <PortfolioAddEditForm />
        </Col>
        <Col />
      </Row>
    </PortfoliosAddPageHeader>
  );
}
