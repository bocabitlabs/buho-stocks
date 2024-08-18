import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import {
  Button,
  Checkbox,
  Group,
  Modal,
  Select,
  Textarea,
  TextInput,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import CountrySelector from "components/CountrySelector/CountrySelector";
import { ICurrency } from "types/currency";
import { IPortfolio, IPortfolioFormFields } from "types/portfolio";

interface AddEditFormProps {
  portfolio?: IPortfolio | undefined;
  currencies: ICurrency[];
  isUpdate?: boolean;
  isVisible: boolean;
  onSubmitCallback: (values: IPortfolioFormFields) => void;
  onCloseCallback: () => void;
}

function PortfolioForm({
  portfolio = undefined,
  currencies,
  isUpdate = false,
  isVisible,
  onSubmitCallback,
  onCloseCallback,
}: Readonly<AddEditFormProps>) {
  const { t } = useTranslation();

  const form = useForm<IPortfolioFormFields>({
    mode: "uncontrolled",
    initialValues: {
      name: portfolio ? portfolio.name : "",
      description: portfolio ? portfolio.description : "",
      hideClosedCompanies: portfolio ? portfolio.hideClosedCompanies : true,
      baseCurrency: portfolio ? portfolio.baseCurrency.id : null,
      countryCode: portfolio ? portfolio.countryCode : "",
      color: "#607d8b",
    },
  });

  const baseCurrenciesOptions = useMemo(
    () =>
      currencies?.map((currency: ICurrency) => ({
        value: currency.code,
        label: t(currency.name),
      })),
    [currencies, t],
  );

  const onCountryChange = (value: string | null) => {
    if (value) {
      console.log("countryCode", value);
      form.setFieldValue("countryCode", value);
    }
  };

  return (
    <Modal
      opened={isVisible}
      title={isUpdate ? t("Update portfolio") : t("Add new portfolio")}
      onClose={onCloseCallback}
    >
      <form onSubmit={form.onSubmit(onSubmitCallback)}>
        <TextInput
          withAsterisk
          label={t("Name")}
          key={form.key("name")}
          // eslint-disable-next-line react/jsx-props-no-spreading
          {...form.getInputProps("name")}
        />

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
        <CountrySelector
          onChange={onCountryChange}
          value={form.getValues().countryCode}
        />
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
          <Button type="button" color="gray" onClick={onCloseCallback}>
            {t("Cancel")}
          </Button>
          <Button type="submit" color="blue">
            {portfolio ? t("Update") : t("Create")}
          </Button>
        </Group>
      </form>
    </Modal>
  );
}

export default PortfolioForm;
