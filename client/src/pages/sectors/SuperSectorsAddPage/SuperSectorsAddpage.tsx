import React from "react";
import { Col, Row } from "antd";
import SuperSectorsAddPageHeader from "./components/SuperSectorsAddPageHeader/SuperSectorsAddPageHeader";
import SuperSectorAddEditForm from "components/SuperSectorAddEditForm/SuperSectorAddEditForm";

export default function SuperSectorsAddPage() {
  return (
    <SuperSectorsAddPageHeader>
      <Row>
        <Col>
          <SuperSectorAddEditForm />
        </Col>
        <Col />
      </Row>
    </SuperSectorsAddPageHeader>
  );
}
