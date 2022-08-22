import { useQuery } from "react-query";
import { apiClient } from "api/api-client";

export const fetchBenchmarks = async () => {
  const { data } = await apiClient.get(`/benchmarks/`);
  return data;
};

export function useBenchmarks(otherOptions?: any) {
  return useQuery(["indexes"], () => fetchBenchmarks(), {
    ...otherOptions,
  });
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
