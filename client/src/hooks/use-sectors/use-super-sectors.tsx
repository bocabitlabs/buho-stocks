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

interface MutateProps {
  onSuccess?: Function;
  onError?: Function;
}

type SectorApiResponse = {
  results: Array<ISector>;
  count: number;
  next: number | null;
  previous: number | null;
};

interface Params {
  pagination?: MRT_PaginationState;
}

export const fetchSuperSectors = async (
  pagination: MRT_PaginationState | undefined,
) => {
  const fetchURL = new URL(
    "/api/v1/super-sectors/",
    apiClient.defaults.baseURL,
  );
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

export const fetchSuperSector = async (sectorId: number | undefined) => {
  if (!sectorId) {
    throw new Error("sectorId is required");
  }
  const { data } = await apiClient.get<ISector>(`/super-sectors/${sectorId}/`);
  return data;
};

export function useSuperSectors({ pagination = undefined }: Params) {
  let queryKey = ["super-sectors", pagination];
  if (!pagination) {
    queryKey = ["super-sectors"];
  }
  return useQuery<SectorApiResponse, Error>({
    queryKey,
    queryFn: () => fetchSuperSectors(pagination),
    placeholderData: keepPreviousData, // useful for paginated queries by keeping data from previous pages on screen while fetching the next page
    staleTime: 30_000, // don't refetch previously viewed pages until cache is more than 30 seconds old
  });
}

export function useSuperSector(sectorId: number | undefined, options?: any) {
  return useQuery<ISector, Error>({
    queryKey: ["super-sectors", sectorId],
    queryFn: () => fetchSuperSector(sectorId),
    enabled: !!sectorId,
    ...options,
  });
}

export const useAddSuperSector = (props?: MutateProps) => {
  const { t } = useTranslation();

  return useMutation({
    mutationFn: (newSector: ISectorFormFields) =>
      apiClient.post(`/super-sectors/`, newSector),
    onSuccess: () => {
      props?.onSuccess?.();
      toast.success<string>(t("Super Sector created"));
      queryClient.invalidateQueries({ queryKey: ["super-sectors"] });
    },
    onError: () => {
      toast.error<string>(t("Unable to create super sector"));
    },
  });
};

export const useDeleteSuperSector = () => {
  const { t } = useTranslation();

  return useMutation({
    mutationFn: (id: number) => apiClient.delete(`/super-sectors/${id}/`),
    onSuccess: () => {
      toast.success<string>(t("Super Sector deleted"));
      queryClient.invalidateQueries({ queryKey: ["super-sectors"] });
    },
    onError: () => {
      toast.error<string>(t("Unable to delete super sector"));
    },
  });
};

export const useUpdateSuperSector = (props?: MutateProps) => {
  const { t } = useTranslation();

  return useMutation({
    mutationFn: ({ id, newSector }: UpdateMutationProps) =>
      apiClient.put(`/super-sectors/${id}/`, newSector),
    onSuccess: () => {
      props?.onSuccess?.();
      toast.success<string>(t("Super Sector has been updated"));
      queryClient.invalidateQueries({ queryKey: ["super-sectors"] });
    },
    onError: () => {
      toast.error<string>(t("Super Unable to update super sector"));
    },
  });
};

export default useSuperSectors;
