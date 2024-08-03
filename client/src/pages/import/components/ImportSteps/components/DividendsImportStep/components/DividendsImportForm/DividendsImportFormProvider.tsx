import { Loader } from "@mantine/core";
import DividendsImportForm from "./DividendsImportForm";
import { usePortfolio } from "hooks/use-portfolios/use-portfolios";
import { IDividendsTransactionFormFields } from "types/dividends-transaction";

interface Props {
  portfolioId: number;
  dividend: IDividendsTransactionFormFields;
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
