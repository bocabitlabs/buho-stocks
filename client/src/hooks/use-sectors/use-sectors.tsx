import { useMutation, useQuery, useQueryClient } from "react-query";
import axios from "axios";
import { axiosOptionsWithAuth } from "api/api-client";
import { ISectorFormFields } from "types/sector";

interface UpdateSectorMutationProps {
  newSector: ISectorFormFields;
  sectorId: number;
}

export const fetchSectors = async (superSectors = false) => {
  let apiUrl = "/api/v1/sectors/";
  if (superSectors) {
    apiUrl += "super/";
  }
  const { data } = await axios.get(apiUrl, axiosOptionsWithAuth);
  return data;
};

export const fetchSector = async (
  sectorId: number | undefined,
  superSector = false,
) => {
  if (!sectorId) {
    throw new Error("sectorId is required");
  }
  let apiUrl = "/api/v1/sectors/";
  if (superSector) {
    apiUrl += "super/";
  }
  const { data } = await axios.get(
    `${apiUrl}${sectorId}/`,
    axiosOptionsWithAuth,
  );
  return data;
};

export const useAddSector = (superSector = false) => {
  const queryClient = useQueryClient();
  let apiUrl = "/api/v1/sectors/";
  let cacheKey = "sectors";
  if (superSector) {
    apiUrl += "super/";
    cacheKey = "superSectors";
  }

  return useMutation(
    (newSector: ISectorFormFields) =>
      axios.post(apiUrl, newSector, axiosOptionsWithAuth),
    {
      onSuccess: () => {
        queryClient.invalidateQueries([cacheKey]);
      },
    },
  );
};

export const useDeleteSector = (superSector = false) => {
  const queryClient = useQueryClient();
  let cacheKey = "sectors";
  let apiUrl = "/api/v1/sectors/";
  if (superSector) {
    apiUrl += "super/";
    cacheKey = "superSectors";
  }

  return useMutation(
    (id: number) => axios.delete(`${apiUrl}${id}/`, axiosOptionsWithAuth),
    {
      onSuccess: () => {
        queryClient.invalidateQueries([cacheKey]);
      },
    },
  );
};

export const useUpdateSector = (superSector = false) => {
  const queryClient = useQueryClient();
  let cacheKey = "sectors";
  let apiUrl = "/api/v1/sectors/";
  if (superSector) {
    apiUrl += "super/";
    cacheKey = "superSectors";
  }

  return useMutation(
    ({ sectorId, newSector }: UpdateSectorMutationProps) =>
      axios.put(`${apiUrl}${sectorId}/`, newSector, axiosOptionsWithAuth),
    {
      onSuccess: () => {
        queryClient.invalidateQueries([cacheKey]);
      },
    },
  );
};

export function useSectors(superSectors = false) {
  let cacheKey = "sectors";
  if (superSectors) {
    cacheKey = "superSectors";
  }

  return useQuery(cacheKey, () => fetchSectors(superSectors));
}

export function useSector(sectorId: number | undefined, superSector = false) {
  let cacheKey = "sectors";
  if (superSector) {
    cacheKey = "superSectors";
  }
  return useQuery(cacheKey, () => fetchSector(sectorId, superSector), {
    // The query will not execute until the userId exists
    enabled: !!sectorId,
  });
}

export default useSectors;
