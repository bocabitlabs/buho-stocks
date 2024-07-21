import SectorsListTable from "./components/SectorsListTable/SectorsListTable";
import SectorsPageHeader from "./components/SectorsPageHeader/SectorsPageHeader";

export default function SectorsListPage() {
  return (
    <SectorsPageHeader>
      <SectorsListTable />
    </SectorsPageHeader>
  );
}
