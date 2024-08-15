import BenchmarkYearForm from "./BenchmarkYearForm";
import { useAddBenchmarkYear } from "hooks/use-benchmarks/use-benchmark-years";
import { IBenchmarkYearFormFields } from "types/benchmark";

interface Props {
  id: number;
}

export default function BenchmarkYearFormProvider({ id }: Props) {
  const { mutate: createBenchmarkYear } = useAddBenchmarkYear();

  const handleSubmit = async (values: IBenchmarkYearFormFields) => {
    const { year, value, valueCurrency, returnPercentage } = values;
    const newBenchmark: IBenchmarkYearFormFields = {
      year,
      value,
      valueCurrency,
      returnPercentage,
      benchmark: +id,
    };

    createBenchmarkYear(newBenchmark);
  };

  return <BenchmarkYearForm benchmarkId={id} onSubmitCallback={handleSubmit} />;
}
