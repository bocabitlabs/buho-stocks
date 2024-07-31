import { useTranslation } from "react-i18next";
import { Alert, Loader } from "@mantine/core";
import DividendsTransactionForm from "./DividendsTransactionForm";
import {
  useAddDividendsTransaction,
  useDividendsTransaction,
  useUpdateDividendsTransaction,
} from "hooks/use-dividends-transactions/use-dividends-transactions";
import { ICurrency } from "types/currency";
import { IDividendsTransactionFormFields } from "types/dividends-transaction";

interface Props {
  transactionId?: number;
  companyId: number;
  isUpdate?: boolean;
  isVisible: boolean;
  companyDividendsCurrency: ICurrency;
  portfolioBaseCurrency: string;
  onCloseCallback: () => void;
}

export default function DividendsTransactionFormProvider({
  companyId,
  transactionId = undefined,
  companyDividendsCurrency,
  portfolioBaseCurrency,
  isVisible,
  onCloseCallback,
  isUpdate = false,
}: Props) {
  const { t } = useTranslation();

  const { mutate: updateTransaction } = useUpdateDividendsTransaction({
    onSuccess: onCloseCallback,
  });
  const { mutate: createTransaction } = useAddDividendsTransaction({
    onSuccess: onCloseCallback,
  });
  const { data, error, isLoading, isError } =
    useDividendsTransaction(transactionId);

  const onSubmitCallback = (values: IDividendsTransactionFormFields) => {
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
      <Alert title={t("Unable to load stock price")} color="red">
        {error?.message}
      </Alert>
    );
  }

  return (
    <DividendsTransactionForm
      companyId={companyId}
      transaction={data}
      isVisible={isVisible}
      isUpdate={isUpdate}
      companyDividendsCurrency={companyDividendsCurrency.code}
      portfolioBaseCurrency={portfolioBaseCurrency}
      onCloseCallback={onCloseCallback}
      onSubmitCallback={onSubmitCallback}
    />
  );
}
