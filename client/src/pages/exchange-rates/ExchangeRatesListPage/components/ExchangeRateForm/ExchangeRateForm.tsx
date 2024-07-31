import { useTranslation } from "react-i18next";
import { Button, Group, Modal, TextInput } from "@mantine/core";
import { DateInput } from "@mantine/dates";
import { useForm } from "@mantine/form";
import { IExchangeRate, IExchangeRateFormFields } from "types/exchange-rate";

interface AddEditFormProps {
  isVisible: boolean;
  isUpdate?: boolean;
  exchangeRate?: IExchangeRate;
  onCloseCallback: () => void;
  onSubmitCallback: (values: IExchangeRateFormFields) => void;
}

function ExchangeRateForm({
  isVisible,
  exchangeRate = undefined,
  isUpdate = false,
  onCloseCallback,
  onSubmitCallback,
}: Readonly<AddEditFormProps>) {
  const { t } = useTranslation();
  const dateFormat = "YYYY-MM-DD";

  const form = useForm<IExchangeRateFormFields>({
    mode: "uncontrolled",
    initialValues: {
      exchangeFrom: exchangeRate ? exchangeRate.exchangeFrom : "",
      exchangeTo: exchangeRate ? exchangeRate.exchangeTo : "",
      exchangeRate: exchangeRate ? exchangeRate.exchangeRate : 0,
      exchangeDate: exchangeRate
        ? new Date(exchangeRate.exchangeDate)
        : new Date(),
    },
  });

  const onSubmit = (values: any) => {
    onSubmitCallback(values);
  };

  const hideModal = () => {
    form.reset();
    onCloseCallback();
  };

  return (
    <Modal
      opened={isVisible}
      title={isUpdate ? t("Update Exchange Rate") : t("Add new exchange rate")}
      onClose={onCloseCallback}
    >
      <form onSubmit={form.onSubmit(onSubmit)}>
        <TextInput
          withAsterisk
          label={t("From currency")}
          key={form.key("exchangeFrom")}
          // eslint-disable-next-line react/jsx-props-no-spreading
          {...form.getInputProps("exchangeFrom")}
        />

        <TextInput
          withAsterisk
          label={t("To currency")}
          key={form.key("exchangeTo")}
          // eslint-disable-next-line react/jsx-props-no-spreading
          {...form.getInputProps("exchangeTo")}
        />
        <TextInput
          withAsterisk
          label={t("Exchange rate")}
          key={form.key("exchangeRate")}
          // eslint-disable-next-line react/jsx-props-no-spreading
          {...form.getInputProps("exchangeRate")}
        />

        <DateInput
          withAsterisk
          label={t("Date")}
          key={form.key("exchangeDate")}
          valueFormat={dateFormat}
          defaultValue={new Date()}
          // eslint-disable-next-line react/jsx-props-no-spreading
          {...form.getInputProps("exchangeDate")}
        />
        <Group justify="space-between" mt="md">
          <Button type="button" color="gray" onClick={hideModal}>
            {t("Cancel")}
          </Button>
          <Button type="submit" color="blue">
            {exchangeRate ? t("Update") : t("Create")}
          </Button>
        </Group>
      </form>
    </Modal>
  );
}

export default ExchangeRateForm;
