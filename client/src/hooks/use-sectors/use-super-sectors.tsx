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

export const fetchSuperSectors = async () => {
  const { data } = await apiClient.get<ISector[]>("/super-sectors/");
  return data;
};

export const fetchSuperSector = async (sectorId: number | undefined) => {
  if (!sectorId) {
    throw new Error("sectorId is required");
  }
  const { data } = await apiClient.get<ISector>(`/super-sectors/${sectorId}/`);
  return data;
};

export function useSuperSectors() {
  return useQuery<ISector[], Error>("super-sectors", fetchSuperSectors);
}

export function useSuperSector(sectorId: number | undefined, options?: any) {
  return useQuery<ISector, Error>(
    ["super-sectors", sectorId],
    () => fetchSuperSector(sectorId),
    {
      enabled: !!sectorId,
      ...options,
    },
  );
}

export const useAddSuperSector = () => {
  const { t } = useTranslation();

  return useMutation(
    (newSector: ISectorFormFields) =>
      apiClient.post(`/super-sectors/`, newSector),
    {
      onSuccess: () => {
        toast.success<string>(t("Super Sector created"));
        queryClient.invalidateQueries(["super-sectors"]);
      },
      onError: () => {
        toast.error<string>(t("Unable to create super sector"));
        queryClient.invalidateQueries(["super-sectors"]);
      },
    },
  );
};

export const useDeleteSuperSector = () => {
  const { t } = useTranslation();

  return useMutation(
    (id: number) => apiClient.delete(`/super-sectors/${id}/`),
    {
      onSuccess: () => {
        toast.success<string>(t("Super Sector deleted"));
        queryClient.invalidateQueries(["super-sectors"]);
      },
      onError: () => {
        toast.error<string>(t("Unable to delete super sector"));
        queryClient.invalidateQueries(["super-sectors"]);
      },
    },
  );
};

export const useUpdateSuperSector = () => {
  const { t } = useTranslation();

  return useMutation(
    ({ id, newSector }: UpdateMutationProps) =>
      apiClient.put(`/super-sectors/${id}/`, newSector),
    {
      onSuccess: () => {
        toast.success<string>(t("Super Sector has been updated"));
        queryClient.invalidateQueries(["super-sectors"]);
      },
      onError: () => {
        toast.error<string>(t("Super Unable to update super sector"));
        queryClient.invalidateQueries(["super-sectors"]);
      },
    },
  );
};

export default useSuperSectors;
