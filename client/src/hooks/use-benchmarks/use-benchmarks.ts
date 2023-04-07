import { useTranslation } from "react-i18next";
import { useMutation, useQuery } from "react-query";
import { toast } from "react-toastify";
import { apiClient } from "api/api-client";
import queryClient from "api/query-client";
import { IBenchmark, IBenchmarkFormFields } from "types/benchmark";

interface UpdateMutationProps {
  newBenchmark: IBenchmarkFormFields;
  id: number | undefined;
}

export const fetchBenchmarks = async () => {
  const { data } = await apiClient.get(`/benchmarks/`);
  return data;
};

export function useBenchmarks(otherOptions?: any) {
  return useQuery<IBenchmark[], Error>(
    ["benchmarks"],
    () => fetchBenchmarks(),
    {
      ...otherOptions,
    },
  );
}

export const fetchBenchmarkValues = async (id: number | undefined) => {
  const { data } = await apiClient.get(`/benchmarks/${id}/`);
  return data;
};

export function useBenchmarkValues(id: number | undefined, otherOptions?: any) {
  return useQuery(["benchmarks", id], () => fetchBenchmarkValues(id), {
    enabled: id !== undefined,
    ...otherOptions,
  });
}

export const fetchBenchmark = async (id: number | undefined) => {
  if (!id) {
    throw new Error("Id is required");
  }
  const { data } = await apiClient.get<IBenchmark>(`/benchmarks/${id}/`);
  return data;
};

export function useBenchmark(id: number | undefined, options?: any) {
  return useQuery<IBenchmark, Error>(
    ["benchmarks", id],
    () => fetchBenchmark(id),
    {
      enabled: !!id,
      ...options,
    },
  );
}

export const useAddBenchmark = () => {
  const { t } = useTranslation();

  return useMutation(
    (newBenchmark: IBenchmarkFormFields) =>
      apiClient.post(`/benchmarks/`, newBenchmark),
    {
      onSuccess: () => {
        toast.success(t("Benchmark created"));
        queryClient.invalidateQueries(["benchmarks"]);
      },
      onError: () => {
        toast.error(t("Unable to create benchmark"));
        queryClient.invalidateQueries(["benchmarks"]);
      },
    },
  );
};

export const useDeleteBenchmark = () => {
  const { t } = useTranslation();

  return useMutation((id: number) => apiClient.delete(`/benchmarks/${id}/`), {
    onSuccess: () => {
      toast.success(t("Benchmark deleted"));
      queryClient.invalidateQueries(["benchmarks"]);
    },
    onError: () => {
      toast.error(t("Unable to delete benchmark"));
      queryClient.invalidateQueries(["benchmarks"]);
    },
  });
};

export const useUpdateBenchmark = () => {
  const { t } = useTranslation();

  return useMutation(
    ({ id, newBenchmark }: UpdateMutationProps) =>
      apiClient.put(`/benchmarks/${id}/`, newBenchmark),
    {
      onSuccess: () => {
        toast.success(t("Benchmark has been updated"));
        queryClient.invalidateQueries(["benchmarks"]);
      },
      onError: () => {
        toast.error(t("Unable to update benchmark"));
        queryClient.invalidateQueries(["benchmarks"]);
      },
    },
  );
};

export const useInitializeBenchmarks = () => {
  const { t } = useTranslation();

  return useMutation(
    () => apiClient.post<IBenchmark[]>(`/initialize-data/benchmarks/`),
    {
      onSuccess: () => {
        toast.success(t("Benchmarks created"));
        queryClient.invalidateQueries(["benchmarks"]);
      },
      onError: () => {
        toast.error(t("Unable to create benchmarks"));
        queryClient.invalidateQueries(["benchmarks"]);
      },
    },
  );
};
