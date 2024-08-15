import { Loader } from "@mantine/core";
import DividendsImportForm from "./DividendsImportForm";
import { usePortfolio } from "hooks/use-portfolios/use-portfolios";
import { ICsvDividendRow } from "types/csv";

interface Props {
  portfolioId: number;
  dividend: ICsvDividendRow;
  onImportedCallback: () => void;
}

export default function DividendsImportFormProvider({
  dividend,
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

  if (portfolio && dividend) {
    return (
      <DividendsImportForm
        dividend={dividend}
        portfolio={portfolio}
        onSubmitCallback={onSubmitCallback}
      />
    );
  }
  return null;
}
