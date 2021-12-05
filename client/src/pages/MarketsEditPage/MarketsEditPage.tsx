import React from "react";
import { useParams } from "react-router-dom";
import { Col, Row } from "antd";
import MarketsEditPageHeader from "./components/MarketsEditPageHeader/MarketsEditPageHeader";
import MarketAddEditForm from "components/MarketAddEditForm/MarketAddEditForm";
import { MarketsContext } from "contexts/markets";
import { useMarketsContext } from "hooks/use-markets/use-markets-context";
import WrapperPage from "pages/WrapperPage/WrapperPage";

// Params are placeholders in the URL that begin
// with a colon, like the `:id` param defined in
// the route in this example. A similar convention
// is used for matching dynami§wc segments in other
// popular web frameworks like Rails and Express.

export interface IParams {
  id: string;
}

export default function MarketsEditPage() {
  const marketsContext = useMarketsContext();
  const params = useParams<IParams>();
  const { id } = params;
  console.log("ID: ", id);
  return (
    <MarketsContext.Provider value={marketsContext}>
      <WrapperPage>
        <MarketsEditPageHeader>
          <Row>
            <Col>
              <MarketAddEditForm marketId={id} />
            </Col>
            <Col />
          </Row>
        </MarketsEditPageHeader>
      </WrapperPage>
    </MarketsContext.Provider>
  );
}
