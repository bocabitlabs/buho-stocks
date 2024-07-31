import { useTranslation } from "react-i18next";
import { Alert, Loader } from "@mantine/core";
import ExchangeRateForm from "./ExchangeRateForm";
import {
  useAddExchangeRate,
  useExchangeRateDetails,
  useUpdateExchangeRate,
} from "hooks/use-exchange-rates/use-exchange-rates";

interface Props {
  id?: number;
  isUpdate?: boolean;
  isVisible: boolean;
  onCloseCallback: () => void;
}

export default function ExchangeRateFormProvider({
  id = undefined,
  isUpdate = false,
  isVisible,
  onCloseCallback,
}: Props) {
  const { t } = useTranslation();

  const { data, error, isLoading, isError } = useExchangeRateDetails(id);

  const { mutate: create } = useAddExchangeRate({
    onSuccess: onCloseCallback,
  });
  const { mutate: update } = useUpdateExchangeRate({
    onSuccess: onCloseCallback,
  });

  const onSubmit = (values: any) => {
    if (isUpdate) {
      update({ id, newExchangeRate: values });
    } else {
      create(values);
    }
  };

  if (isLoading && !data) {
    return <Loader variant="dots" />;
  }

  if (isError) {
    return (
      <Alert title={t("Unable to load Exchange Rate")} color="red">
        {error.message}
      </Alert>
    );
  }

  return (
    <ExchangeRateForm
      exchangeRate={data}
      isUpdate={isUpdate}
      isVisible={isVisible}
      onCloseCallback={onCloseCallback}
      onSubmitCallback={onSubmit}
    />
  );
}
