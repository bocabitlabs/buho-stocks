import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import { useMutation, useQuery } from "@tanstack/react-query";
import { MRT_PaginationState } from "mantine-react-table";
import { apiClient } from "api/api-client";
import queryClient from "api/query-client";
import { IBenchmark, IBenchmarkFormFields } from "types/benchmark";

interface UpdateMutationProps {
  newBenchmark: IBenchmarkFormFields;
  id: number | undefined;
}

type BenchmarksApiResponse = {
  results: Array<IBenchmark>;
  count: number;
  next: number | null;
  previous: number | null;
};

interface Params {
  pagination: MRT_PaginationState;
  otherOptions?: any;
}

export const fetchBenchmarks = async (pagination: MRT_PaginationState) => {
  const fetchURL = new URL("/api/v1/benchmarks/", apiClient.defaults.baseURL);

  fetchURL.searchParams.set(
    "offset",
    `${pagination.pageIndex * pagination.pageSize}`,
  );
  fetchURL.searchParams.set("limit", `${pagination.pageSize}`);
  const { data } = await apiClient.get<BenchmarksApiResponse>(fetchURL.href);
  return data;
};

export function useBenchmarks({
  pagination,
  otherOptions = undefined,
}: Params) {
  return useQuery<BenchmarksApiResponse, Error>({
    queryKey: ["benchmarks", pagination],
    queryFn: () => fetchBenchmarks(pagination),
    ...otherOptions,
  });
}

export const fetchAllBenchmarks = async () => {
  const fetchURL = new URL("/api/v1/benchmarks/", apiClient.defaults.baseURL);

  const { data } = await apiClient.get<IBenchmark[]>(fetchURL.href);
  return data;
};

export function useAllBenchmarks() {
  return useQuery<IBenchmark[], Error>({
    queryKey: ["benchmarks"],
    queryFn: fetchAllBenchmarks,
  });
}

export const fetchBenchmarkValues = async (id: number | undefined) => {
  const { data } = await apiClient.get(`/benchmarks/${id}/`);
  return data;
};

export function useBenchmarkValues(id: number | undefined, otherOptions?: any) {
  return useQuery({
    queryKey: ["benchmarks", id],
    queryFn: () => fetchBenchmarkValues(id),
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
  return useQuery<IBenchmark, Error>({
    queryKey: ["benchmarks", id],
    queryFn: () => fetchBenchmark(id),
    enabled: !!id,
    ...options,
  });
}

interface MutateProps {
  onSuccess?: Function;
  onError?: Function;
}

export const useAddBenchmark = (props?: MutateProps) => {
  const { t } = useTranslation();

  return useMutation({
    mutationFn: (newBenchmark: IBenchmarkFormFields) =>
      apiClient.post(`/benchmarks/`, newBenchmark),
    onSuccess: () => {
      props?.onSuccess?.();
      toast.success(t("Benchmark created"));
      queryClient.invalidateQueries({ queryKey: ["benchmarks"] });
    },
    onError: () => {
      props?.onError?.();
      toast.error(t("Unable to create benchmark"));
    },
  });
};

export const useDeleteBenchmark = () => {
  const { t } = useTranslation();

  return useMutation({
    mutationFn: (id: number) => apiClient.delete(`/benchmarks/${id}/`),
    onSuccess: () => {
      toast.success(t("Benchmark deleted"));
      queryClient.invalidateQueries({ queryKey: ["benchmarks"] });
    },
    onError: () => {
      toast.error(t("Unable to delete benchmark"));
    },
  });
};

export const useUpdateBenchmark = (props?: MutateProps) => {
  const { t } = useTranslation();

  return useMutation({
    mutationFn: ({ id, newBenchmark }: UpdateMutationProps) =>
      apiClient.put(`/benchmarks/${id}/`, newBenchmark),
    onSuccess: () => {
      props?.onSuccess?.();
      toast.success(t("Benchmark has been updated"));
      queryClient.invalidateQueries({ queryKey: ["benchmarks"] });
    },
    onError: () => {
      props?.onError?.();
      toast.error(t("Unable to update benchmark"));
    },
  });
};

export const useInitializeBenchmarks = () => {
  const { t } = useTranslation();

  return useMutation({
    mutationFn: () =>
      apiClient.post<IBenchmark[]>(`/initialize-data/benchmarks/`),

    onSuccess: () => {
      toast.success(t("Benchmarks created"));
      queryClient.invalidateQueries({ queryKey: ["benchmarks"] });
    },
    onError: () => {
      toast.error(t("Unable to create benchmarks"));
    },
  });
};
