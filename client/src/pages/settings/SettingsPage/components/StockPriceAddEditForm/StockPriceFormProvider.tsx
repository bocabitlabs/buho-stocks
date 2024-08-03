import { useTranslation } from "react-i18next";
import { Alert, Loader } from "@mantine/core";
import StockPriceForm from "./StockPriceForm";
import {
  useAddStockPrice,
  useStockPrice,
  useUpdateStockPrice,
} from "hooks/use-stock-prices/use-stock-prices";
import { IStockPriceFormFields } from "types/stock-prices";

interface Props {
  id?: number;
  isUpdate?: boolean;
  isVisible: boolean;
  onCloseCallback: () => void;
}

export default function StockPriceFormProvider({
  id = undefined,
  isUpdate = false,
  isVisible,
  onCloseCallback,
}: Props) {
  const { t } = useTranslation();
  const { data, isLoading, isError, error } = useStockPrice(id);

  const { mutate: create } = useAddStockPrice({
    onSuccess: onCloseCallback,
  });
  const { mutate: update } = useUpdateStockPrice({
    onSuccess: onCloseCallback,
  });

  const onSubmitCallback = (values: IStockPriceFormFields) => {
    if (isUpdate) {
      update({ newStockPrice: values, id });
    } else {
      create(values);
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
    <StockPriceForm
      data={data}
      isVisible={isVisible}
      onCloseCallback={onCloseCallback}
      onSubmitCallback={onSubmitCallback}
      isUpdate={isUpdate}
    />
  );
}
