import { useTranslation } from "react-i18next";
import { Alert, Loader } from "@mantine/core";
import PortfolioForm from "./PortfolioForm";
import { useAllCurrencies } from "hooks/use-currencies/use-currencies";
import {
  useAddPortfolio,
  usePortfolio,
  useUpdatePortfolio,
} from "hooks/use-portfolios/use-portfolios";
import { IPortfolioFormFields } from "types/portfolio";

interface Props {
  portfolioId?: number;
  isUpdate?: boolean;
  isVisible: boolean;
  onCloseCallback: () => void;
}

export default function PortfolioFormProvider({
  portfolioId = undefined,
  isUpdate = false,
  isVisible,
  onCloseCallback,
}: Props) {
  const { t } = useTranslation();
  const { mutate: createPortfolio } = useAddPortfolio({
    onSuccess: onCloseCallback,
  });
  const { mutate: updatePortfolio } = useUpdatePortfolio({
    onSuccess: onCloseCallback,
  });
  const {
    data: currencies,
    isLoading: currenciesLoading,
    isError: isErrorCurrencies,
    error: errorCurrencies,
  } = useAllCurrencies();
  const {
    data: portfolio,
    error,
    isError,
    isLoading,
  } = usePortfolio(portfolioId);

  const onSubmitCallback = (values: IPortfolioFormFields) => {
    if (isUpdate) {
      updatePortfolio({ portfolioId, newPortfolio: values });
    } else {
      createPortfolio(values);
    }
  };

  if (isLoading || currenciesLoading) {
    return <Loader color="blue" type="dots" />;
  }

  if (isError || isErrorCurrencies) {
    return (
      <Alert title={t("Unable to load portfolio")} color="red">
        {error?.message}
        {errorCurrencies?.message}
      </Alert>
    );
  }

  if (currencies) {
    return (
      <PortfolioForm
        portfolio={portfolio}
        currencies={currencies}
        onSubmitCallback={onSubmitCallback}
        onCloseCallback={onCloseCallback}
        isVisible={isVisible}
      />
    );
  }
  return null;
}
