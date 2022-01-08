import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Col, Row, Spin } from "antd";
import useFetch from "use-http";
import MarketsEditPageHeader from "./components/MarketsEditPageHeader/MarketsEditPageHeader";
import MarketAddEditForm from "components/MarketAddEditForm/MarketAddEditForm";
import { IMarket } from "types/market";

export default function MarketsEditPage() {
  const { id } = useParams();
  const marketIdString: string = id!;
  const [market, setMarket] = useState<IMarket | null>(null);
  const { response, get } = useFetch(
    "markets",
    {
      suspense: true,
    },
    [],
  );

  useEffect(() => {
    async function loadInitialMarket() {
      const initialData = await get(`${id}/`);
      if (response.ok) setMarket(initialData);
    }
    loadInitialMarket();
  }, [response.ok, get, id]);

  if (!market) {
    return <Spin />;
  }

  return (
    <MarketsEditPageHeader marketName={market.name}>
      <Row>
        <Col>
          <MarketAddEditForm marketId={marketIdString} />
        </Col>
        <Col />
      </Row>
    </MarketsEditPageHeader>
  );
}
