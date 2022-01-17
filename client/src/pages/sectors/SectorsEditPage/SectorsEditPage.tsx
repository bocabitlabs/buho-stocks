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
  const { data, error, isFetching } = useSector(idString);

  if (isFetching) {
    return <div>Loading the sector...</div>;
  }

  if (error) {
    return <div>Error fetching the sectors</div>;
  }

  return (
    <SectorsEditPageHeader sectorName={data.name}>
      <Row>
        <Col>
          <SectorAddEditForm sector={data} isSuper />
        </Col>
        <Col />
      </Row>
    </SectorsEditPageHeader>
  );
}
SectorsEditPage.defaultProps = {
  isSuper: false,
};
