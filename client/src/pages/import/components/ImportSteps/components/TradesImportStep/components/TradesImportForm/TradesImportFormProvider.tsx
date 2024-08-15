import { Loader } from "@mantine/core";
import TradesImportForm from "./TradesImportForm";
import { usePortfolio } from "hooks/use-portfolios/use-portfolios";
import { ICsvTradesRow } from "types/csv";

interface Props {
  portfolioId: number;
  trade: ICsvTradesRow;
  onImportedCallback: () => void;
}

export default function TradesImportFormProvider({
  trade,
  portfolioId,
  onImportedCallback,
}: Props) {
  const { data: portfolio, isLoading } = usePortfolio(portfolioId);

  const onSubmitCallback = () => {
    onImportedCallback();
  };

  if (isLoading) {
    return <Loader />;
  }

  if (portfolio && trade) {
    return (
      <TradesImportForm
        trade={trade}
        portfolio={portfolio}
        onSubmitCallback={onSubmitCallback}
      />
    );
  }
  return null;
}
