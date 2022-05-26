import { useMutation, useQuery } from "react-query";
import { toast } from "react-toastify";
import { apiClient } from "api/api-client";
import queryClient from "api/query-client";
import { ISector, ISectorFormFields } from "types/sector";

interface UpdateSectorMutationProps {
  newSector: ISectorFormFields;
  sectorId: number;
}

export const fetchSuperSectors = async () => {
  const { data } = await apiClient.get<ISector[]>("/sectors/super/");
  return data;
};

export const fetchSuperSector = async (sectorId: number | undefined) => {
  if (!sectorId) {
    throw new Error("sectorId is required");
  }
  const { data } = await apiClient.get<ISector>(`/sectors/super/${sectorId}/`);
  return data;
};

export const useAddSuperSector = () => {
  return useMutation(
    (newSector: ISectorFormFields) =>
      apiClient.post("/sectors/super/", newSector),
    {
      onSuccess: () => {
        toast.success("Super sector has been added");
        queryClient.invalidateQueries("superSectors");
      },
      onError: (err) => {
        toast.error(`Cannot create super sector: ${err}`);
      },
    },
  );
};

export const useDeleteSuperSector = () => {
  return useMutation(
    (id: number) => apiClient.delete(`/sectors/super/${id}/`),
    {
      onSuccess: () => {
        toast.success("Super sector has been deleted");
        queryClient.invalidateQueries("sectors");
      },
      onError: (err) => {
        toast.error(`Cannot delete sector: ${err}`);
      },
    },
  );
};

export const useUpdateSuperSector = () => {
  return useMutation(
    ({ sectorId, newSector }: UpdateSectorMutationProps) =>
      apiClient.put(`/sectors/super/${sectorId}/`, newSector),
    {
      onSuccess: () => {
        toast.success("Super sector has been updated");
        queryClient.invalidateQueries("superSectors");
      },
      onError: (err) => {
        toast.error(`Cannot update super sector: ${err}`);
      },
    },
  );
};

export function useSuperSectors() {
  return useQuery<ISector[], Error>("superSectors", fetchSuperSectors);
}

export function useSuperSector(sectorId: number | undefined, options?: any) {
  return useQuery<ISector, Error>(
    ["superSectors", sectorId],
    () => fetchSuperSector(sectorId),
    {
      enabled: !!sectorId,
      ...options,
    },
  );
}

export default useSuperSectors;
