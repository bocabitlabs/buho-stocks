import { useTranslation } from "react-i18next";
import { useMutation, useQuery } from "react-query";
import { toast } from "react-toastify";
import { apiClient } from "api/api-client";
import queryClient from "api/query-client";
import { ISector, ISectorFormFields } from "types/sector";

interface UpdateMutationProps {
  newSector: ISectorFormFields;
  id: number | undefined;
}

export const fetchSectors = async () => {
  const { data } = await apiClient.get<ISector[]>("/sectors/");
  return data;
};

export const fetchSector = async (sectorId: number | undefined) => {
  if (!sectorId) {
    throw new Error("sectorId is required");
  }
  const { data } = await apiClient.get<ISector>(`/sectors/${sectorId}/`);
  return data;
};

export function useSectors() {
  return useQuery<ISector[], Error>("sectors", fetchSectors);
}

export function useSector(sectorId: number | undefined, options?: any) {
  return useQuery<ISector, Error>(
    ["sectors", sectorId],
    () => fetchSector(sectorId),
    {
      enabled: !!sectorId,
      ...options,
    },
  );
}

export const useAddSector = () => {
  const { t } = useTranslation();

  return useMutation(
    (newSector: ISectorFormFields) => apiClient.post(`/sectors/`, newSector),
    {
      onSuccess: () => {
        toast.success<string>(t("Sector created"));
        queryClient.invalidateQueries(["sectors"]);
      },
      onError: () => {
        toast.error<string>(t("Unable to create sector"));
        queryClient.invalidateQueries(["sectors"]);
      },
    },
  );
};

export const useDeleteSector = () => {
  const { t } = useTranslation();

  return useMutation((id: number) => apiClient.delete(`/sectors/${id}/`), {
    onSuccess: () => {
      toast.success<string>(t("Sector deleted"));
      queryClient.invalidateQueries(["sectors"]);
    },
    onError: () => {
      toast.error<string>(t("Unable to delete sector"));
      queryClient.invalidateQueries(["sectors"]);
    },
  });
};

export const useUpdateSector = () => {
  const { t } = useTranslation();

  return useMutation(
    ({ id, newSector }: UpdateMutationProps) =>
      apiClient.put(`/sectors/${id}/`, newSector),
    {
      onSuccess: () => {
        toast.success<string>(t("Sector has been updated"));
        queryClient.invalidateQueries(["sectors"]);
      },
      onError: () => {
        toast.error<string>(t("Unable to update sector"));
        queryClient.invalidateQueries(["sectors"]);
      },
    },
  );
};

export const useInitializeSectors = () => {
  const { t } = useTranslation();

  return useMutation(
    () => apiClient.post<ISector[]>(`/initialize-data/sectors/`),
    {
      onSuccess: () => {
        toast.success<string>(t("Sectors created"));
        queryClient.invalidateQueries(["sectors"]);
      },
      onError: () => {
        toast.error<string>(t("Unable to create sectors"));
        queryClient.invalidateQueries(["sectors"]);
      },
    },
  );
};

export default useSectors;
