import { useTranslation } from "react-i18next";
import { Alert, Loader } from "@mantine/core";
import MarketAddEditForm from "./MarketForm";
import {
  useAddMarket,
  useMarket,
  useTimezones,
  useUpdateMarket,
} from "hooks/use-markets/use-markets";
import { IMarketFormFields } from "types/market";

interface Props {
  id?: number;
  isUpdate?: boolean;
  isVisible: boolean;
  onCloseCallback: () => void;
}

function MarketAddEditFormProvider({
  id,
  isUpdate = false,
  isVisible,
  onCloseCallback,
}: Readonly<Props>) {
  const { t } = useTranslation();
  const { data, isLoading, isError, error } = useMarket(id);
  const {
    data: timezones,
    isLoading: isLoadingTimezones,
    isError: isErrorTimezones,
    error: errorTimezones,
  } = useTimezones();

  const { mutate: createMarket } = useAddMarket({
    onSuccess: onCloseCallback,
  });

  const { mutate: updatedMarket } = useUpdateMarket({
    onSuccess: onCloseCallback,
  });

  const onSubmitCallback = (values: IMarketFormFields) => {
    if (isUpdate) {
      updatedMarket({ newMarket: values, id });
    } else {
      createMarket(values);
    }
  };

  if (isLoading || isLoadingTimezones) {
    return <Loader color="blue" type="dots" />;
  }

  if (isError) {
    return (
      <Alert title={t("Unable to load market")} color="red">
        {error?.message}
      </Alert>
    );
  }

  if (isErrorTimezones) {
    return (
      <Alert title={t("Unable to load timezones")} color="red">
        {errorTimezones?.message}
      </Alert>
    );
  }

  if (timezones) {
    return (
      <MarketAddEditForm
        data={data}
        timezones={timezones}
        isVisible={isVisible}
        onCloseCallback={onCloseCallback}
        onSubmitCallback={onSubmitCallback}
        isUpdate={isUpdate}
      />
    );
  }
  return null;
}

export default MarketAddEditFormProvider;
