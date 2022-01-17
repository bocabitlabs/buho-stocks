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
  const { data, error, isFetching } = useSuperSector(idString);

  if (isFetching) {
    return <div>Loading the sector with super...</div>;
  }

  if (error) {
    return <div>Error fetching the sectors</div>;
  }

  return (
    <SuperSectorsEditPageHeader sectorName={data.name}>
      <Row>
        <Col>
          <SuperSectorAddEditForm sector={data} />
        </Col>
        <Col />
      </Row>
    </SuperSectorsEditPageHeader>
  );
}
