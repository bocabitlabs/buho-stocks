import React, { useContext } from "react";
import { Col, Row } from "antd";
import SectorsAddPageHeader from "./components/SectorsAddHeader/SectorsAddHeader";
import SectorAddEditForm from "components/SectorAddEditForm/SectorAddEditForm";
import { MarketsContext } from "contexts/markets";
import WrapperPage from "pages/WrapperPage/WrapperPage";

// Params are placeholders in the URL that begin
// with a colon, like the `:id` param defined in
// the route in this example. A similar convention
// is used for matching dynami§wc segments in other
// popular web frameworks like Rails and Express.

export default function SectorsAddPage() {
  const marketsContext = useContext(MarketsContext);

  return (
    <MarketsContext.Provider value={marketsContext}>
      <WrapperPage>
        <SectorsAddPageHeader>
          <Row>
            <Col>
              <SectorAddEditForm />
            </Col>
            <Col />
          </Row>
        </SectorsAddPageHeader>
      </WrapperPage>
    </MarketsContext.Provider>
  );
}
