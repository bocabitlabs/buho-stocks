import { useTranslation } from "react-i18next";
import { Alert, Loader } from "@mantine/core";
import SharesTransactionForm from "./SharesTransactionForm";
import {
  useAddSharesTransaction,
  useSharesTransaction,
  useUpdateSharesTransaction,
} from "hooks/use-shares-transactions/use-shares-transactions";
import { ICurrency } from "types/currency";
import { ISharesTransactionFormFields } from "types/shares-transaction";

interface Props {
  transactionId?: number;
  companyId: number;
  isUpdate?: boolean;
  isVisible: boolean;
  companyBaseCurrency: ICurrency;
  portfolioBaseCurrency: string;
  onCloseCallback: () => void;
}

export default function SharesTransactionFormProvider({
  companyId,
  transactionId = undefined,
  companyBaseCurrency,
  portfolioBaseCurrency,
  isVisible,
  onCloseCallback,
  isUpdate = false,
}: Props) {
  const { t } = useTranslation();

  const { mutate: updateTransaction } = useUpdateSharesTransaction({
    onSuccess: onCloseCallback,
  });
  const { mutate: createTransaction } = useAddSharesTransaction({
    onSuccess: onCloseCallback,
  });
  const { data, error, isLoading, isError } =
    useSharesTransaction(transactionId);

  const onSubmitCallback = (values: ISharesTransactionFormFields) => {
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
      <Alert title={t("Unable to load shares transaction")} color="red">
        {error?.message}
      </Alert>
    );
  }

  return (
    <SharesTransactionForm
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
