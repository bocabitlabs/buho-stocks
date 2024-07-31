import { useTranslation } from "react-i18next";
import { Alert, Loader } from "@mantine/core";
import BenchmarForm from "./BenchmarkForm";
import {
  useAddBenchmark,
  useBenchmark,
  useUpdateBenchmark,
} from "hooks/use-benchmarks/use-benchmarks";
import { IBenchmarkFormFields } from "types/benchmark";

interface Props {
  id?: number;
  isUpdate?: boolean;
  isVisible: boolean;
  onCloseCallback: () => void;
}

export default function BenchmarkFormProvider({
  id = undefined,
  isUpdate = false,
  isVisible,
  onCloseCallback,
}: Props) {
  const { t } = useTranslation();
  const { data, error, isLoading, isError } = useBenchmark(id);

  const { mutate: updateBenchmark } = useUpdateBenchmark({
    onSuccess: onCloseCallback,
  });
  const { mutate: createBenchmark } = useAddBenchmark({
    onSuccess: onCloseCallback,
  });

  const onSubmitCallback = (values: IBenchmarkFormFields) => {
    if (isUpdate) {
      updateBenchmark({ newBenchmark: values, id });
    } else {
      createBenchmark(values);
    }
  };

  if (isLoading) {
    return <Loader color="blue" type="dots" />;
  }

  if (isError) {
    return (
      <Alert title={t("Unable to load stock price")} color="red">
        {error?.message}
      </Alert>
    );
  }

  return (
    <BenchmarForm
      data={data}
      isVisible={isVisible}
      onCloseCallback={onCloseCallback}
      onSubmitCallback={onSubmitCallback}
      isUpdate={isUpdate}
    />
  );
}
