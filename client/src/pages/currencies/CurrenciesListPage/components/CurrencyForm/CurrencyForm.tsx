import { useTranslation } from "react-i18next";
import { Button, Group, Modal, TextInput } from "@mantine/core";
import { useForm } from "@mantine/form";
import { ICurrency, ICurrencyFormFields } from "types/currency";

interface AddEditFormProps {
  currency?: ICurrency;
  isUpdate?: boolean;
  isVisible: boolean;
  onCloseCallback?: () => void;
  onSubmitCallback?: (values: ICurrencyFormFields) => void;
}

function CurrencyForm({
  currency = undefined,
  isUpdate = false,
  isVisible,
  onCloseCallback = () => {},
  onSubmitCallback = () => {},
}: Readonly<AddEditFormProps>) {
  const { t } = useTranslation();

  const form = useForm<ICurrencyFormFields>({
    mode: "uncontrolled",
    initialValues: {
      name: currency ? currency.name : "",
      code: currency ? currency.code : "",
      symbol: currency ? currency.symbol : "",
    },
  });

  const onSubmit = (values: ICurrencyFormFields) => {
    onSubmitCallback(values);
  };

  const hideModal = () => {
    form.reset();
    onCloseCallback();
  };

  return (
    <Modal
      opened={isVisible}
      title={isUpdate ? t("Update currency") : t("Add new currency")}
      onClose={onCloseCallback}
    >
      <form onSubmit={form.onSubmit(onSubmit)}>
        <TextInput
          withAsterisk
          label={t("Name")}
          key={form.key("name")}
          // eslint-disable-next-line react/jsx-props-no-spreading
          {...form.getInputProps("name")}
        />
        <TextInput
          withAsterisk
          label={t("Code")}
          key={form.key("code")}
          // eslint-disable-next-line react/jsx-props-no-spreading
          {...form.getInputProps("code")}
        />
        <TextInput
          withAsterisk
          label={t("Symbol")}
          key={form.key("symbol")}
          // eslint-disable-next-line react/jsx-props-no-spreading
          {...form.getInputProps("symbol")}
        />
        <Group justify="space-between" mt="md">
          <Button type="button" color="gray" onClick={hideModal}>
            {t("Cancel")}
          </Button>
          <Button type="submit" color="blue">
            {currency ? t("Update") : t("Create")}
          </Button>
        </Group>
      </form>
    </Modal>
  );
}

export default CurrencyForm;
