import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Col, Row, Spin } from "antd";
import useFetch from "use-http";
import SectorsEditPageHeader from "./components/SectorsEditPageHeader/SectorsEditPageHeader";
import SectorAddEditForm from "components/SectorAddEditForm/SectorAddEditForm";
import { ISector } from "types/sector";

interface IProps {
  isSuper?: boolean;
}

export default function SectorsEditPage({ isSuper }: IProps) {
  const params = useParams();
  const { id } = params;
  const [sector, setSector] = useState<ISector | null>(null);
  const { response, get } = useFetch(
    "sectors",
    {
      suspense: true,
    },
    [],
  );

  useEffect(() => {
    async function loadInitialSector() {
      const initialData = await get(`${id}/`);
      if (response.ok) setSector(initialData);
    }
    loadInitialSector();
  }, [response.ok, get, id]);

  if (!sector) {
    return <Spin />;
  }

  return (
    <SectorsEditPageHeader sectorName={sector.name}>
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
  isSuper: false,
};
