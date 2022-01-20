import React from "react";
import { useParams } from "react-router-dom";
// import { Col, Row, Spin } from "antd";
import { Col, Row } from "antd";
import SectorsEditPageHeader from "./components/SectorsEditPageHeader/SectorsEditPageHeader";
// import SectorAddEditForm from "components/SectorAddEditForm/SectorAddEditForm";
import SectorAddEditForm from "components/SectorAddEditForm/SectorAddEditForm";
import { useSector } from "hooks/use-sectors/use-sectors";

export default function SectorsEditPage() {
  const params = useParams();
  const { id } = params;
  const idString: number = +id!;
  const { data: sector, error, isFetching } = useSector(idString);

  if (isFetching || !sector) {
    return <div>Loading the sector...</div>;
  }

  if (error) {
    return <div>Error fetching the sectors</div>;
  }

  return (
    <SectorsEditPageHeader sectorName={sector.name}>
      <Row>
        <Col>
          <SectorAddEditForm sector={sector} isSuper />
        </Col>
        <Col />
      </Row>
    </SectorsEditPageHeader>
  );
}
SectorsEditPage.defaultProps = {
  isSuper: false,
};
