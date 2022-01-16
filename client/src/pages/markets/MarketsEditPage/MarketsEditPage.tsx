import React from "react";
import { useParams } from "react-router-dom";
import { Col, Row, Spin } from "antd";
import MarketsEditPageHeader from "./components/MarketsEditPageHeader/MarketsEditPageHeader";
import MarketAddEditForm from "components/MarketAddEditForm/MarketAddEditForm";
import { useMarket } from "hooks/use-markets/use-markets";

export default function MarketsEditPage() {
  const { id } = useParams();
  const marketIdString: number = +id!;
  const { data, error, isFetching } = useMarket(marketIdString);

  if (isFetching) {
    return (
      <div>
        <Spin /> Loading de market...
      </div>
    );
  }

  if (error) {
    <div>Error fetching the data</div>;
  }

  return (
    <MarketsEditPageHeader marketName={data.name}>
      <Row>
        <Col>
          <MarketAddEditForm market={data} />
        </Col>
        <Col />
      </Row>
    </MarketsEditPageHeader>
  );
}
