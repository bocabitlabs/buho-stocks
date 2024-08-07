import { useTranslation } from "react-i18next";
import { Button, TextInput } from "@mantine/core";
import { useForm } from "@mantine/form";
import { IBenchmarkYearFormFields } from "types/benchmark";

interface AddFormProps {
  benchmarkId: number;
  onSubmitCallback: (values: IBenchmarkYearFormFields) => void;
}

function BenchmarkYearForm({ benchmarkId, onSubmitCallback }: AddFormProps) {
  const { t } = useTranslation();

  const form = useForm<IBenchmarkYearFormFields>({
    mode: "uncontrolled",
    initialValues: {
      year: new Date().getFullYear(),
      value: 0,
      valueCurrency: "",
      returnPercentage: 0,
      benchmark: benchmarkId,
    },
  });

  const onSubmit = (values: any) => {
    onSubmitCallback(values);
  };

  return (
    <div>
      <form onSubmit={form.onSubmit(onSubmit)}>
        <TextInput
          withAsterisk
          label={t("Year")}
          key={form.key("year")}
          // eslint-disable-next-line react/jsx-props-no-spreading
          {...form.getInputProps("year")}
        />
        <TextInput
          mt="md"
          withAsterisk
          label={t("Value")}
          key={form.key("value")}
          // eslint-disable-next-line react/jsx-props-no-spreading
          {...form.getInputProps("value")}
        />
        <TextInput
          mt="md"
          withAsterisk
          label={t("Value in currency")}
          key={form.key("valueCurrency")}
          // eslint-disable-next-line react/jsx-props-no-spreading
          {...form.getInputProps("valueCurrency")}
        />
        <TextInput
          mt="md"
          withAsterisk
          label={t("Yield")}
          key={form.key("returnPercentage")}
          // eslint-disable-next-line react/jsx-props-no-spreading
          {...form.getInputProps("returnPercentage")}
        />
        <Button type="submit" color="blue" mt="md">
          {t("Add benchmark year")}
        </Button>
      </form>
    </div>
  );
}

export default BenchmarkYearForm;
