import React from "react";
import { useParams } from "react-router-dom";
import { Col, Row } from "antd";
import SuperSectorsEditPageHeader from "./components/SectorsEditPageHeader/SuperSectorsEditPageHeader";
import SuperSectorAddEditForm from "components/SuperSectorAddEditForm/SuperSectorAddEditForm";
import { useSuperSector } from "hooks/use-sectors/use-super-sectors";

export default function SuperSectorsEditPage() {
  const params = useParams();
  const { id } = params;
  const idString: number = +id!;
  const { data: sector, error, isFetching } = useSuperSector(idString);

  if (isFetching || !sector) {
    return <div>Loading the sector with super...</div>;
  }

  if (error) {
    return <div>Error fetching the sectors</div>;
  }

  return (
    <SuperSectorsEditPageHeader sectorName={sector.name}>
      <Row>
        <Col>
          <SuperSectorAddEditForm sector={sector} />
        </Col>
        <Col />
      </Row>
    </SuperSectorsEditPageHeader>
  );
}
