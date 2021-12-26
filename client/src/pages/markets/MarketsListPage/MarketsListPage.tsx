import React from "react";
import MarketsListTable from "./components/MarketsListTable/MarketsListTable";
import MarketsPageHeader from "./components/MarketsPageHeader/MarketsPageHeader";

export default function MarketsListPage() {
  return (
    <MarketsPageHeader>
      <MarketsListTable />
    </MarketsPageHeader>
  );
}
