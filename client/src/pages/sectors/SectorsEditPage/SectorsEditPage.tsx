import React from "react";
import { useParams } from "react-router-dom";
import { Col, Row } from "antd";
import SectorsEditPageHeader from "./components/SectorsEditHeader/SectorsEditHeader";
import SectorAddEditForm from "components/SectorAddEditForm/SectorAddEditForm";

interface IProps {
  isSuper?: boolean;
}

export default function SectorsEditPage({ isSuper }: IProps) {
  const params = useParams();
  const { id } = params;
  console.log("ID in Page: ", id);

  return (
    <SectorsEditPageHeader>
      <Row>
        <Col>
          <SectorAddEditForm sectorId={id} isSuper={isSuper} />
        </Col>
        <Col />
      </Row>
    </SectorsEditPageHeader>
  );
}
SectorsEditPage.defaultProps = {
  isSuper: false
};
