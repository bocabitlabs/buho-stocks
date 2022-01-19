import { useMutation, useQuery, useQueryClient } from "react-query";
import axios from "axios";
import { getAxiosOptionsWithAuth } from "api/api-client";
import { ISectorFormFields } from "types/sector";

interface UpdateSectorMutationProps {
  newSector: ISectorFormFields;
  sectorId: number;
}

export const fetchSectors = async () => {
  const apiUrl = "/api/v1/sectors/";
  const { data } = await axios.get(apiUrl, getAxiosOptionsWithAuth());
  return data;
};

export const fetchSector = async (sectorId: number | undefined) => {
  if (!sectorId) {
    throw new Error("sectorId is required");
  }
  const apiUrl = "/api/v1/sectors/";
  const { data } = await axios.get(
    `${apiUrl}${sectorId}/`,
    getAxiosOptionsWithAuth(),
  );
  return data;
};

export const useAddSector = () => {
  const queryClient = useQueryClient();
  const apiUrl = "/api/v1/sectors/";
  const cacheKey = "sectors";

  return useMutation(
    (newSector: ISectorFormFields) =>
      axios.post(apiUrl, newSector, getAxiosOptionsWithAuth()),
    {
      onSuccess: () => {
        queryClient.invalidateQueries([cacheKey]);
      },
    },
  );
};

export const useDeleteSector = () => {
  const queryClient = useQueryClient();
  const cacheKey = "sectors";
  const apiUrl = "/api/v1/sectors/";

  return useMutation(
    (id: number) => axios.delete(`${apiUrl}${id}/`, getAxiosOptionsWithAuth()),
    {
      onSuccess: () => {
        queryClient.invalidateQueries([cacheKey]);
      },
    },
  );
};

export const useUpdateSector = () => {
  const queryClient = useQueryClient();
  const apiUrl = "/api/v1/sectors/";

  return useMutation(
    ({ sectorId, newSector }: UpdateSectorMutationProps) =>
      axios.put(`${apiUrl}${sectorId}/`, newSector, getAxiosOptionsWithAuth()),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["sectors"]);
      },
    },
  );
};

export function useSectors() {
  return useQuery(["sectors"], fetchSectors);
}

export function useSector(sectorId: number | undefined) {
  return useQuery(["sectors", sectorId], () => fetchSector(sectorId), {
    // The query will not execute until the userId exists
    enabled: !!sectorId,
  });
}

export default useSectors;
