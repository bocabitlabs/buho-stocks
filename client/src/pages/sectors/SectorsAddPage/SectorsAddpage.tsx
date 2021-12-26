import React from "react";
import { Col, Row } from "antd";
import SectorsAddPageHeader from "./components/SectorsAddHeader/SectorsAddHeader";
import SectorAddEditForm from "components/SectorAddEditForm/SectorAddEditForm";

export default function SectorsAddPage() {
  return (
    <SectorsAddPageHeader>
      <Row>
        <Col>
          <SectorAddEditForm />
        </Col>
        <Col />
      </Row>
    </SectorsAddPageHeader>
  );
}
