import { useTranslation } from "react-i18next";
import { Button, Group, Modal, TextInput } from "@mantine/core";
import { DateInput } from "@mantine/dates";
import { useForm } from "@mantine/form";
import { IStockPrice, IStockPriceFormFields } from "types/stock-prices";

interface AddEditFormProps {
  data?: IStockPrice;
  isUpdate?: boolean;
  isVisible: boolean;
  onCloseCallback?: () => void;
  onSubmitCallback: (values: IStockPriceFormFields) => void;
}

function StockPriceAddEditForm({
  data = undefined,
  isUpdate = false,
  isVisible,
  onCloseCallback = () => {},
  onSubmitCallback,
}: Readonly<AddEditFormProps>) {
  const { t } = useTranslation();
  const dateFormat = "YYYY-MM-DD";

  const form = useForm<IStockPriceFormFields>({
    mode: "uncontrolled",
    initialValues: {
      ticker: data ? data.ticker : "",
      transactionDate: data ? new Date(data.transactionDate) : new Date(),
      price: data ? data.price : 0,
      priceCurrency: data ? data.priceCurrency : "",
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
      title={isUpdate ? t("Update stock price") : t("Add new stock price")}
      onClose={onCloseCallback}
    >
      <form onSubmit={form.onSubmit(onSubmit)}>
        <TextInput
          withAsterisk
          label={t("Ticker")}
          key={form.key("ticker")}
          // eslint-disable-next-line react/jsx-props-no-spreading
          {...form.getInputProps("ticker")}
        />

        <TextInput
          withAsterisk
          label={t("Price")}
          key={form.key("price")}
          // eslint-disable-next-line react/jsx-props-no-spreading
          {...form.getInputProps("price")}
        />
        <TextInput
          withAsterisk
          label={t("Currency")}
          key={form.key("priceCurrency")}
          // eslint-disable-next-line react/jsx-props-no-spreading
          {...form.getInputProps("priceCurrency")}
        />
        <DateInput
          withAsterisk
          label={t("Date")}
          key={form.key("transactionDate")}
          valueFormat={dateFormat}
          defaultValue={new Date()}
          // eslint-disable-next-line react/jsx-props-no-spreading
          {...form.getInputProps("transactionDate")}
        />
        <Group justify="space-between" mt="md">
          <Button type="button" color="gray" onClick={hideModal}>
            {t("Cancel")}
          </Button>
          <Button type="submit" color="blue">
            {data ? t("Update") : t("Create")}
          </Button>
        </Group>
      </form>
    </Modal>
  );
}

export default StockPriceAddEditForm;
