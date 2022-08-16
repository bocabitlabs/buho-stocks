import { useQuery } from "react-query";
import { apiClient } from "api/api-client";
import { ISector } from "types/sector";

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
