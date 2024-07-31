import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import { useMutation } from "@tanstack/react-query";
import { apiClient } from "api/api-client";
import queryClient from "api/query-client";
import { IBenchmarkYearFormFields } from "types/benchmark";

interface IDeleteMutationProps {
  id: number;
}

export const useDeleteBenchmarkYear = () => {
  const { t } = useTranslation();

  return useMutation({
    mutationFn: ({ id }: IDeleteMutationProps) =>
      apiClient.delete(`/benchmarks-years/${id}/`),
    onSuccess: (data, variables) => {
      toast.success(t("Year deleted"));
      queryClient.invalidateQueries({
        queryKey: ["benchmarks", variables.id],
      });
    },
    onError: () => {
      toast.error(t("Unable to delete year"));
    },
  });
};

export const useAddBenchmarkYear = () => {
  const { t } = useTranslation();

  return useMutation({
    mutationFn: (newBenchmark: IBenchmarkYearFormFields) =>
      apiClient.post(`/benchmarks-years/`, newBenchmark),
    onSuccess: (data, variables) => {
      toast.success(t("Benchmark year added"));
      queryClient.invalidateQueries({
        queryKey: ["benchmarks", variables.benchmark],
      });
    },
    onError: (data, variables) => {
      toast.error(t("Unable to add year"));
      queryClient.invalidateQueries({
        queryKey: ["benchmarks", variables.benchmark],
      });
    },
  });
};

export default useDeleteBenchmarkYear;
