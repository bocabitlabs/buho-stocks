import { useTranslation } from "react-i18next";
import { Button, Group, Modal, TextInput } from "@mantine/core";
import { useForm } from "@mantine/form";
import { IBenchmark, IBenchmarkFormFields } from "types/benchmark";

interface AddEditFormProps {
  data?: IBenchmark;
  isUpdate: boolean;
  isVisible: boolean;
  onCloseCallback: () => void;
  onSubmitCallback: (values: IBenchmarkFormFields) => void;
}

function BenchmarkForm({
  isVisible,
  data = undefined,
  isUpdate,
  onCloseCallback,
  onSubmitCallback,
}: AddEditFormProps) {
  const { t } = useTranslation();

  const form = useForm<IBenchmarkFormFields>({
    mode: "uncontrolled",
    initialValues: {
      name: data ? data.name : "",
    },
  });

  const onSubmit = (values: IBenchmarkFormFields) => {
    onSubmitCallback(values);
  };

  const hideModal = () => {
    form.reset();
    onCloseCallback();
  };

  return (
    <Modal
      opened={isVisible}
      title={isUpdate ? t("Update benchmark") : t("Add new benchmark")}
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

export default BenchmarkForm;
