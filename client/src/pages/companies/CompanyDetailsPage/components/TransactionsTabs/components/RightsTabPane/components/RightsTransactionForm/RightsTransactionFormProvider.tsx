import { useTranslation } from "react-i18next";
import { Alert, Loader } from "@mantine/core";
import RightsTransactionForm from "./RightsTransactionForm";
import {
  useAddRightsTransaction,
  useRightsTransaction,
  useUpdateRightsTransaction,
} from "hooks/use-rights-transactions/use-rights-transactions";
import { ICurrency } from "types/currency";
import { IRightsTransactionFormFields } from "types/rights-transaction";

interface Props {
  transactionId?: number;
  companyId: number;
  isUpdate?: boolean;
  isVisible: boolean;
  companyBaseCurrency: ICurrency;
  portfolioBaseCurrency: string;
  onCloseCallback: () => void;
}

export default function RightsTransactionFormProvider({
  companyId,
  transactionId = undefined,
  companyBaseCurrency,
  portfolioBaseCurrency,
  isVisible,
  onCloseCallback,
  isUpdate = false,
}: Props) {
  const { t } = useTranslation();

  const { mutate: updateTransaction } = useUpdateRightsTransaction({
    onSuccess: onCloseCallback,
  });
  const { mutate: createTransaction } = useAddRightsTransaction({
    onSuccess: onCloseCallback,
  });
  const { data, error, isLoading, isError } =
    useRightsTransaction(transactionId);

  const onSubmitCallback = (values: IRightsTransactionFormFields) => {
    if (isUpdate && transactionId) {
      updateTransaction({
        newTransaction: values,
        transactionId,
        updatePortfolio: true,
      });
    } else {
      createTransaction({ newTransaction: values, updatePortfolio: true });
    }
  };

  if (isLoading) {
    return <Loader color="blue" type="dots" />;
  }

  if (isError) {
    return (
      <Alert title={t("Unable to load rights transaction")} color="red">
        {error?.message}
      </Alert>
    );
  }

  return (
    <RightsTransactionForm
      companyId={companyId}
      transaction={data}
      isVisible={isVisible}
      isUpdate={isUpdate}
      companyBaseCurrency={companyBaseCurrency.code}
      portfolioBaseCurrency={portfolioBaseCurrency}
      onCloseCallback={onCloseCallback}
      onSubmitCallback={onSubmitCallback}
    />
  );
}
