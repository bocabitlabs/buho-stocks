import { useMutation, useQuery } from "react-query";
import { toast } from "react-toastify";
import { apiClient } from "api/api-client";
import queryClient from "api/query-client";
import { ISector, ISectorFormFields } from "types/sector";

interface UpdateSectorMutationProps {
  newSector: ISectorFormFields;
  sectorId: number;
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

export const useAddSector = () => {
  return useMutation(
    (newSector: ISectorFormFields) => apiClient.post("/sectors/", newSector),
    {
      onSuccess: () => {
        toast.success("Sector has been added");
        queryClient.invalidateQueries("sectors");
      },
    },
  );
};

export const useDeleteSector = () => {
  return useMutation((id: number) => apiClient.delete(`/sectors/${id}/`), {
    onSuccess: () => {
      toast.success("Sector has been deleted");
      queryClient.invalidateQueries("sectors");
    },
    onError: (err) => {
      toast.error(`Cannot create sector: ${err}`);
    },
  });
};

export const useUpdateSector = () => {
  return useMutation(
    ({ sectorId, newSector }: UpdateSectorMutationProps) =>
      apiClient.put(`/sectors/${sectorId}/`, newSector),
    {
      onSuccess: () => {
        toast.success("Sector has been updated");
        queryClient.invalidateQueries("sectors");
      },
      onError: (err) => {
        toast.error(`Cannot update sector: ${err}`);
      },
    },
  );
};

export function useSectors() {
  return useQuery<ISector[], Error>("sectors", fetchSectors);
}

export function useSector(sectorId: number | undefined, options: any) {
  return useQuery<ISector, Error>(
    ["sectors", sectorId],
    () => fetchSector(sectorId),
    {
      enabled: !!sectorId,
      ...options,
    },
  );
}

export default useSectors;
