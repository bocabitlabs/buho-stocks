import React, { FC, ReactNode, useContext, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import { Spin } from "antd";
import { MarketsContext } from "contexts/markets";

const MarketEditPageLoader: FC<ReactNode> = ({ children }) => {
  const { isLoading, market, getById: getMarket } = useContext(MarketsContext);
  const { id } = useParams();

  const cancelRequest = useRef<boolean>(false);

  useEffect(() => {
    if (cancelRequest.current) return undefined;
    console.log("MarketEditPageLoader: useEffect: id", id);
    getMarket(+id!);
    return () => {
      console.log("Cancelling request");
      cancelRequest.current = true;
    };
  }, [getMarket, id]);

  if (isLoading || !market) {
    return <Spin />;
  }

  return <>{children}</>;
};

export default MarketEditPageLoader;
