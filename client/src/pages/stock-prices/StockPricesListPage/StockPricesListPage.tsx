import StockPricesListTable from "./components/StockPricesListTable/StockPricesListTable";
import StockPricesPageHeader from "./components/StockPricesPageHeader/StockPricesPageHeader";

export default function ExchangeRatesListPage() {
  return (
    <StockPricesPageHeader>
      <StockPricesListTable />
    </StockPricesPageHeader>
  );
}
