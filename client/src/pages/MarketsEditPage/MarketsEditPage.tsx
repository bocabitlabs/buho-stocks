import { Col, Row } from "antd";
import MarketAddEditForm from "components/MarketAddEditForm/MarketAddEditForm";
import { MarketsContext } from "contexts/markets";
import WrapperPage from "pages/WrapperPage/WrapperPage";
import React, { useContext } from "react";
import MarketsEditPageHeader from "./components/MarketsEditPageHeader/MarketsEditPageHeader";

// Params are placeholders in the URL that begin
// with a colon, like the `:id` param defined in
// the route in this example. A similar convention
// is used for matching dynami§wc segments in other
// popular web frameworks like Rails and Express.

export default function MarketsAddPage() {
  const marketsContext = useContext(MarketsContext);

  return (
    <WrapperPage>
      <MarketsContext.Provider value={marketsContext}>
        <MarketsEditPageHeader>
          <Row>
            <Col>
              {/* <MarketAddEditForm /> */}
            </Col>
            <Col></Col>
          </Row>
        </MarketsEditPageHeader>
      </MarketsContext.Provider>
    </WrapperPage>
  );
}
