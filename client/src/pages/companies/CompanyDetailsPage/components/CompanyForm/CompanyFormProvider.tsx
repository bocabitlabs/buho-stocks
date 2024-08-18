import { useTranslation } from "react-i18next";
import { Alert, Loader } from "@mantine/core";
import CompanyForm from "./CompanyForm";
import {
  useAddCompany,
  useCompany,
  useUpdateCompany,
} from "hooks/use-companies/use-companies";
import { useAllCurrencies } from "hooks/use-currencies/use-currencies";
import { useAllMarkets } from "hooks/use-markets/use-markets";
import { useAllSectors } from "hooks/use-sectors/use-sectors";
import { ICompanyFormFields } from "types/company";

type Props = {
  companyId?: number;
  portfolioId: number;
  isUpdate?: boolean;
  isVisible: boolean;
  onCloseCallback?: () => void;
};

export default function CompanyFormProvider({
  companyId = undefined,
  portfolioId,
  isUpdate = false,
  isVisible,
  onCloseCallback = () => {},
}: Props) {
  const { t } = useTranslation();
  const {
    data: currencies,
    isLoading: isLoadingCurrencies,
    isError: isErrorCurrencies,
    error: errorCurrencies,
  } = useAllCurrencies();
  const {
    data: markets,
    isLoading: isLoadingMarkets,
    isError: isErrorMarkets,
    error: errorMarkets,
  } = useAllMarkets();
  const {
    data: sectors,
    isLoading: isLoadingSectors,
    isError: isErrorSectors,
    error: errorSectors,
  } = useAllSectors();

  const {
    data: company,
    isLoading: isLoadingCompany,
    isError: isErrorCompany,
    error: errorCompany,
  } = useCompany(portfolioId, companyId);

  const { mutate: createCompany } = useAddCompany({
    onSuccess: onCloseCallback,
  });
  const { mutate: updateCompany } = useUpdateCompany({
    onSuccess: onCloseCallback,
  });

  const onSubmitCallback = (values: ICompanyFormFields) => {
    const newValues = { ...values };
    if (
      newValues.logo === null ||
      (newValues.logo &&
        (newValues.logo.startsWith("https://") ||
          newValues.logo.startsWith("http://")))
    ) {
      delete newValues.logo;
    }
    if (isUpdate) {
      updateCompany({ portfolioId, companyId, newCompany: newValues });
    } else {
      createCompany({ portfolioId, newCompany: newValues });
    }
  };

  if (!currencies || !markets || !sectors) {
    return null;
  }

  if (
    isLoadingCurrencies ||
    isLoadingMarkets ||
    isLoadingSectors ||
    isLoadingCompany
  ) {
    return <Loader color="blue" type="dots" />;
  }

  if (isUpdate && isLoadingCompany) {
    return <Loader color="blue" type="dots" />;
  }

  if (isErrorCompany || isErrorCurrencies || isErrorMarkets || isErrorSectors) {
    return (
      <Alert title={t("Unable to load company")} color="red">
        {errorCompany?.message}
        {errorCurrencies?.message}
        {errorMarkets?.message}
        {errorSectors?.message}
      </Alert>
    );
  }

  if (currencies && markets && sectors) {
    return (
      <CompanyForm
        isVisible={isVisible}
        portfolioId={portfolioId}
        company={company}
        isUpdate={isUpdate}
        markets={markets}
        sectors={sectors}
        currencies={currencies}
        onCloseCallback={onCloseCallback}
        onSubmitCallback={onSubmitCallback}
      />
    );
  }
}
