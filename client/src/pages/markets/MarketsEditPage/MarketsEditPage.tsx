import React from "react";
import { useParams } from "react-router-dom";
import { Col, Row } from "antd";
import MarketsEditPageHeader from "./components/MarketsEditPageHeader/MarketsEditPageHeader";
import MarketAddEditForm from "components/MarketAddEditForm/MarketAddEditForm";

export default function MarketsEditPage() {
  const params = useParams();
  const { id } = params;
  const marketIdString: string = id!;
  return (
    <MarketsEditPageHeader>
      <Row>
        <Col>
          <MarketAddEditForm marketId={marketIdString} />
        </Col>
        <Col />
      </Row>
    </MarketsEditPageHeader>
  );
}
