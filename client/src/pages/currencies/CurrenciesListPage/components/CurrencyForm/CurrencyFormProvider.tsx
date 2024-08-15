import { useTranslation } from "react-i18next";
import { Alert, Loader } from "@mantine/core";
import CurrencyForm from "./CurrencyForm";
import {
  useAddCurrency,
  useCurrency,
  useUpdateCurrency,
} from "hooks/use-currencies/use-currencies";
import { ICurrencyFormFields } from "types/currency";

type Props = {
  id?: number;
  isUpdate?: boolean;
  isVisible: boolean;
  onCloseCallback: () => void;
};

export default function CurrencyFormProvider({
  id = undefined,
  isUpdate = false,
  isVisible,
  onCloseCallback,
}: Props) {
  const { t } = useTranslation();
  const { data, error, isLoading, isError } = useCurrency(id);

  const { mutate: createCurrency } = useAddCurrency({
    onSuccess: onCloseCallback,
  });
  const { mutate: updateCurrency } = useUpdateCurrency({
    onSuccess: onCloseCallback,
  });

  const onSubmitCallback = (values: ICurrencyFormFields) => {
    if (isUpdate) {
      updateCurrency({ id, newCurrency: values });
    } else {
      createCurrency(values);
    }
  };

  if (isLoading) {
    return <Loader color="blue" type="dots" />;
  }

  if (isError) {
    return (
      <Alert title={t("Unable to load currency")} color="red">
        {error?.message}
      </Alert>
    );
  }

  return (
    <CurrencyForm
      currency={data}
      isVisible={isVisible}
      onCloseCallback={onCloseCallback}
      onSubmitCallback={onSubmitCallback}
      isUpdate={isUpdate}
    />
  );
}
