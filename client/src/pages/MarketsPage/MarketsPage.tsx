import React, { useContext } from "react";
import MarketsListTable from "./components/MarketsListTable/MarketsListTable";
import MarketsPageHeader from "./components/MarketsPageHeader/MarketsPageHeader";
import { MarketsContext } from "contexts/markets";
import WrapperPage from "pages/WrapperPage/WrapperPage";

// Params are placeholders in the URL that begin
// with a colon, like the `:id` param defined in
// the route in this example. A similar convention
// is used for matching dynami§wc segments in other
// popular web frameworks like Rails and Express.

export default function Markets() {
  const marketsContext = useContext(MarketsContext);

  return (
    <WrapperPage>
      <MarketsContext.Provider value={marketsContext}>
        <MarketsPageHeader>
          <MarketsListTable />
        </MarketsPageHeader>
      </MarketsContext.Provider>
    </WrapperPage>
  );
}
