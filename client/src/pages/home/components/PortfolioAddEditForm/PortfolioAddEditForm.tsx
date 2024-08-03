import { ReactElement, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Alert,
  Button,
  Checkbox,
  Group,
  Modal,
  Select,
  Textarea,
  TextInput,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { IconPlus } from "@tabler/icons-react";
import CountrySelector from "components/CountrySelector/CountrySelector";
import LoadingSpin from "components/LoadingSpin/LoadingSpin";
import { useAllCurrencies } from "hooks/use-currencies/use-currencies";
import {
  useAddPortfolio,
  usePortfolio,
  useUpdatePortfolio,
} from "hooks/use-portfolios/use-portfolios";
import { ICurrency } from "types/currency";

interface AddEditFormProps {
  portfolioId?: number;
  isUpdate?: boolean;
}

function PortfolioAddEditForm({
  portfolioId,
  isUpdate = false,
}: Readonly<AddEditFormProps>): ReactElement | null {
  const { t } = useTranslation();
  const { mutate: createPortfolio, isSuccess: isAddSuccess } =
    useAddPortfolio();
  const { mutate: updatePortfolio, isSuccess: isUpdateSuccess } =
    useUpdatePortfolio();
  const { data: currencies, isFetching: currenciesLoading } =
    useAllCurrencies();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const {
    data: portfolio,
    error: errorFetchingPortfolio,
    isLoading: isErrorLoading,
  } = usePortfolio(portfolioId);

  const form = useForm({
    mode: "uncontrolled",
    initialValues: {
      name: portfolio ? portfolio.name : "",
      description: portfolio ? portfolio.description : "",
      hideClosedCompanies: portfolio ? portfolio.hideClosedCompanies : true,
      baseCurrency: portfolio ? portfolio.baseCurrency : "",
      countryCode: portfolio ? portfolio.countryCode : "",
      color: "#607d8b",
    },
  });

  const onSubmit = (values: any) => {
    if (isUpdate && portfolioId) {
      updatePortfolio({ portfolioId, newPortfolio: values });
    } else {
      createPortfolio(values);
    }
  };

  const baseCurrenciesOptions = currencies?.map((currency: ICurrency) => ({
    value: currency.code,
    label: t(currency.name),
  }));

  useEffect(() => {
    if (isAddSuccess || isUpdateSuccess) {
      form.reset();
      setIsModalVisible(false);
    }
  }, [isAddSuccess, isUpdateSuccess, form]);

  if (isErrorLoading) {
    return <LoadingSpin />;
  }

  if (errorFetchingPortfolio) {
    return (
      <Alert title={t("Unable to load portfolio")} color="red">
        {errorFetchingPortfolio.message}
      </Alert>
    );
  }

  return (
    <>
      <Modal
        opened={isModalVisible}
        title={t("Add new portfolio")}
        onClose={() => setIsModalVisible(false)}
      >
        <form onSubmit={form.onSubmit(onSubmit)}>
          <TextInput
            withAsterisk
            label={t("Name")}
            key={form.key("name")}
            // eslint-disable-next-line react/jsx-props-no-spreading
            {...form.getInputProps("name")}
          />
          {currenciesLoading ? (
            t("Loading currencies...")
          ) : (
            <Select
              mt="md"
              withAsterisk
              searchable
              label={t("Base currency")}
              data={baseCurrenciesOptions}
              // eslint-disable-next-line react/jsx-props-no-spreading
              {...form.getInputProps("baseCurrency")}
              required
            />
          )}
          <CountrySelector form={form} />
          <Checkbox
            mt="md"
            label={t("Hide closed companies")}
            key={form.key("hideClosedCompanies")}
            // eslint-disable-next-line react/jsx-props-no-spreading
            {...form.getInputProps("hideClosedCompanies", { type: "checkbox" })}
          />
          <Textarea
            mt="md"
            label={t("Description")}
            key={form.key("description")}
            // eslint-disable-next-line react/jsx-props-no-spreading
            {...form.getInputProps("description")}
          />

          <Group justify="space-between" mt="md">
            <Button
              type="button"
              color="gray"
              onClick={() => setIsModalVisible(false)}
            >
              {t("Cancel")}
            </Button>
            <Button type="submit" color="blue">
              {portfolio ? t("Update") : t("Create")}
            </Button>
          </Group>
        </form>
      </Modal>
      <Button
        onClick={() => setIsModalVisible(true)}
        leftSection={<IconPlus />}
      >
        {t("Add portfolio")}
      </Button>
    </>
  );
}

export default PortfolioAddEditForm;
