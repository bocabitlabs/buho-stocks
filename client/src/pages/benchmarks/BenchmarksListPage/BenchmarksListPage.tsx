import React from "react";
import BenchmarksListPageHeader from "./components/BenchmarksListPageHeader/BenchmarksListPageHeader";
import BenchmarksListTable from "./components/BenchmarksListTable/BenchmarksListTable";

export default function BenchmarksListPage() {
  return (
    <BenchmarksListPageHeader>
      <BenchmarksListTable />
    </BenchmarksListPageHeader>
  );
}
