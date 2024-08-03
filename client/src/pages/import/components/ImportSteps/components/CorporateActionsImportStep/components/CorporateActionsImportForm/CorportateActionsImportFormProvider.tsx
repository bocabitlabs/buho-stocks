import { Loader } from "@mantine/core";
import CorporateActionsImportForm from "./CorporateActionsImporForm";
import { usePortfolio } from "hooks/use-portfolios/use-portfolios";
import { ISharesTransactionFormFields } from "types/shares-transaction";

interface Props {
  portfolioId: number;
  corporateAction: ISharesTransactionFormFields;
  onImportedCallback: () => void;
}

export default function CorporateActionsImportFormProvider({
  corporateAction,
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

  if (portfolio && corporateAction) {
    return (
      <CorporateActionsImportForm
        corporateAction={corporateAction}
        portfolio={portfolio}
        onSubmitCallback={onSubmitCallback}
      />
    );
  }
  return null;
}
