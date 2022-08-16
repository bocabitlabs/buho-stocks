import { useQuery } from "react-query";
import { apiClient } from "api/api-client";
import { ISector } from "types/sector";

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
