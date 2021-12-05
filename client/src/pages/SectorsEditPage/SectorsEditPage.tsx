import React from "react";
import { useParams } from "react-router-dom";
import { Col, Row } from "antd";
import SectorLoader from "./components/SectorLoader/SectorLoader";
import SectorsEditPageHeader from "./components/SectorsEditHeader/SectorsEditHeader";
import SectorAddEditForm from "components/SectorAddEditForm/SectorAddEditForm";
import { SectorsContext } from "contexts/secctors";
import { useSectorsContext } from "hooks/use-sectors/use-sectors-context";
import WrapperPage from "pages/WrapperPage/WrapperPage";

// Params are placeholders in the URL that begin
// with a colon, like the `:id` param defined in
// the route in this example. A similar convention
// is used for matching dynami§wc segments in other
// popular web frameworks like Rails and Express.

export interface IParams {
  id: string;
}

export default function SectorsEditPage() {
  const sectorsContext = useSectorsContext();
  const params = useParams<IParams>();
  const { id } = params;
  console.log("ID in Page: ", id);

  return (
    <SectorsContext.Provider value={sectorsContext}>
      <SectorLoader>
        <WrapperPage>
          <SectorsEditPageHeader>
            <Row>
              <Col>
                <SectorAddEditForm sectorId={id} />
              </Col>
              <Col />
            </Row>
          </SectorsEditPageHeader>
        </WrapperPage>
      </SectorLoader>
    </SectorsContext.Provider>
  );
}
