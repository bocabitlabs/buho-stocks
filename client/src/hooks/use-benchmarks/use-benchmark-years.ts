import { useTranslation } from "react-i18next";
import { useMutation } from "react-query";
import { toast } from "react-toastify";
import { apiClient } from "api/api-client";
import queryClient from "api/query-client";
import { IBenchmarkYearFormFields } from "types/benchmark";

interface IDeleteMutationProps {
  id: number;
  benchmarkId: number;
}

export const useDeleteBenchmarkYear = () => {
  const { t } = useTranslation();

  return useMutation(
    ({ id }: IDeleteMutationProps) =>
      apiClient.delete(`/benchmarks-years/${id}/`),
    {
      onSuccess: (data, variables) => {
        toast.success(t("Year deleted"));
        queryClient.invalidateQueries(["benchmarks", variables.benchmarkId]);
      },
      onError: (data, variables) => {
        toast.error(t("Unable to delete year"));
        queryClient.invalidateQueries(["benchmarks", variables.benchmarkId]);
      },
    },
  );
};

export const useAddBenchmarkYear = () => {
  const { t } = useTranslation();

  return useMutation(
    (newBenchmark: IBenchmarkYearFormFields) =>
      apiClient.post(`/benchmarks-years/`, newBenchmark),
    {
      onSuccess: (data, variables) => {
        toast.success(t("Benchmark year added"));
        queryClient.invalidateQueries(["benchmarks", variables.benchmark]);
      },
      onError: (data, variables) => {
        toast.error(t("Unable to add year"));
        queryClient.invalidateQueries(["benchmarks", variables.benchmark]);
      },
    },
  );
};

export default useDeleteBenchmarkYear;
