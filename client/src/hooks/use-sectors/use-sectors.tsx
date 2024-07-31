import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import { keepPreviousData, useMutation, useQuery } from "@tanstack/react-query";
import { MRT_PaginationState } from "mantine-react-table";
import { apiClient } from "api/api-client";
import queryClient from "api/query-client";
import { ISector, ISectorFormFields } from "types/sector";

interface UpdateMutationProps {
  newSector: ISectorFormFields;
  id: number | undefined;
}

type SectorApiResponse = {
  results: Array<ISector>;
  count: number;
  next: number | null;
  previous: number | null;
};

export const fetchSectors = async (
  pagination: MRT_PaginationState | undefined,
) => {
  const fetchURL = new URL("/api/v1/sectors/", apiClient.defaults.baseURL);
  if (pagination) {
    fetchURL.searchParams.set(
      "offset",
      `${pagination.pageIndex * pagination.pageSize}`,
    );
    fetchURL.searchParams.set("limit", `${pagination.pageSize}`);
  }
  const { data } = await apiClient.get<SectorApiResponse>(fetchURL.href);
  return data;
};

export const fetchSector = async (sectorId: number | undefined) => {
  if (!sectorId) {
    throw new Error("sectorId is required");
  }
  const { data } = await apiClient.get<ISector>(`/sectors/${sectorId}/`);
  return data;
};

interface Params {
  pagination?: MRT_PaginationState;
}

export function useSectors({ pagination = undefined }: Params) {
  let queryKey = ["sectors", pagination];
  if (!pagination) {
    queryKey = ["sectors"];
  }
  return useQuery<SectorApiResponse, Error>({
    queryKey,
    queryFn: () => fetchSectors(pagination),
    placeholderData: keepPreviousData, // useful for paginated queries by keeping data from previous pages on screen while fetching the next page
    staleTime: 30_000, // don't refetch previously viewed pages until cache is more than 30 seconds old
  });
}

export const fetchAllSectors = async () => {
  const fetchURL = new URL("/api/v1/sectors/", apiClient.defaults.baseURL);
  const { data } = await apiClient.get<ISector[]>(fetchURL.href);
  return data;
};

export function useAllSectors() {
  return useQuery<ISector[], Error>({
    queryKey: ["sectors"],
    queryFn: () => fetchAllSectors(),
  });
}

export function useSector(sectorId: number | undefined, options?: any) {
  return useQuery<ISector, Error>({
    queryKey: ["sectors", sectorId],
    queryFn: () => fetchSector(sectorId),
    enabled: !!sectorId,
    ...options,
  });
}

interface MutateProps {
  onSuccess?: Function;
  onError?: Function;
}

export const useAddSector = (props?: MutateProps) => {
  const { t } = useTranslation();

  return useMutation({
    mutationFn: (newSector: ISectorFormFields) =>
      apiClient.post(`/sectors/`, newSector),
    onSuccess: () => {
      props?.onSuccess?.();
      toast.success<string>(t("Sector created"));
      queryClient.invalidateQueries({ queryKey: ["sectors"] });
    },
    onError: () => {
      props?.onError?.();
      toast.error<string>(t("Unable to create sector"));
    },
  });
};

export const useDeleteSector = () => {
  const { t } = useTranslation();

  return useMutation({
    mutationFn: (id: number) => apiClient.delete(`/sectors/${id}/`),
    onSuccess: (data, variables) => {
      toast.success<string>(t("Sector deleted"));
      console.log("variables", variables);
      console.log("data", data);
      queryClient.removeQueries({ queryKey: ["sectors", variables] });
      queryClient.invalidateQueries({ queryKey: ["sectors"] });
    },
    onError: () => {
      toast.error<string>(t("Unable to delete sector"));
    },
  });
};

export const useUpdateSector = (props?: MutateProps) => {
  const { t } = useTranslation();

  return useMutation({
    mutationFn: ({ id, newSector }: UpdateMutationProps) =>
      apiClient.put(`/sectors/${id}/`, newSector),
    onSuccess: () => {
      props?.onSuccess?.();
      toast.success<string>(t("Sector has been updated"));
      queryClient.invalidateQueries({ queryKey: ["sectors"] });
    },
    onError: () => {
      props?.onError?.();
      toast.error<string>(t("Unable to update sector"));
      queryClient.invalidateQueries({ queryKey: ["sectors"] });
    },
  });
};

export const useInitializeSectors = () => {
  const { t } = useTranslation();

  return useMutation({
    mutationFn: () => apiClient.post<ISector[]>(`/initialize-data/sectors/`),

    onSuccess: () => {
      toast.success<string>(t("Sectors created"));
      queryClient.invalidateQueries({ queryKey: ["sectors"] });
    },
    onError: () => {
      toast.error<string>(t("Unable to create sectors"));
    },
  });
};

export default useSectors;
