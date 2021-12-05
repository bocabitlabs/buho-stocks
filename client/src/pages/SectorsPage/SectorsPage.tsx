import React, { useContext } from "react";
import SectorsListTable from "./components/SectorsListTable/SectorsListTable";
import SectorsPageHeader from "./components/SectorsPageHeader/SectorsPageHeader";
import { SectorsContext } from "contexts/secctors";
import WrapperPage from "pages/WrapperPage/WrapperPage";

// Params are placeholders in the URL that begin
// with a colon, like the `:id` param defined in
// the route in this example. A similar convention
// is used for matching dynami§wc segments in other
// popular web frameworks like Rails and Express.

export default function Sectors() {
  const context = useContext(SectorsContext);

  return (
    <SectorsContext.Provider value={context}>
      <WrapperPage>
        <SectorsPageHeader>
          <SectorsListTable />
        </SectorsPageHeader>
      </WrapperPage>
    </SectorsContext.Provider>
  );
}
