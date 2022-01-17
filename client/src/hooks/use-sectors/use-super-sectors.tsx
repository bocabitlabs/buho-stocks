import { useMutation, useQuery, useQueryClient } from "react-query";
import axios from "axios";
import { axiosOptionsWithAuth } from "api/api-client";
import { ISectorFormFields } from "types/sector";

interface UpdateSectorMutationProps {
  newSector: ISectorFormFields;
  sectorId: number;
}

export const fetchSuperSectors = async () => {
  const apiUrl = "/api/v1/sectors/super/";
  const { data } = await axios.get(apiUrl, axiosOptionsWithAuth);
  return data;
};

export const fetchSuperSector = async (sectorId: number | undefined) => {
  if (!sectorId) {
    throw new Error("sectorId is required");
  }
  const apiUrl = "/api/v1/sectors/super/";
  const { data } = await axios.get(
    `${apiUrl}${sectorId}/`,
    axiosOptionsWithAuth,
  );
  return data;
};

export const useAddSuperSector = () => {
  const queryClient = useQueryClient();
  const apiUrl = "/api/v1/sectors/super/";

  return useMutation(
    (newSector: ISectorFormFields) =>
      axios.post(apiUrl, newSector, axiosOptionsWithAuth),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["superSectors"]);
      },
    },
  );
};

export const useDeleteSuperSector = () => {
  const queryClient = useQueryClient();
  const apiUrl = "/api/v1/sectors/super/";

  return useMutation(
    (id: number) => axios.delete(`${apiUrl}${id}/`, axiosOptionsWithAuth),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["superSectors"]);
      },
    },
  );
};

export const useUpdateSuperSector = () => {
  const queryClient = useQueryClient();
  const apiUrl = "/api/v1/sectors/super/";

  return useMutation(
    ({ sectorId, newSector }: UpdateSectorMutationProps) =>
      axios.put(`${apiUrl}${sectorId}/`, newSector, axiosOptionsWithAuth),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["superSectors"]);
      },
    },
  );
};

export function useSuperSectors() {
  return useQuery("superSectors", fetchSuperSectors);
}

export function useSuperSector(sectorId: number | undefined) {
  return useQuery("superSectors", () => fetchSuperSector(sectorId), {
    // The query will not execute until the userId exists
    enabled: !!sectorId,
  });
}

export default useSuperSectors;
