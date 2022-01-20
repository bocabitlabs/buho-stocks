import { useMutation, useQuery } from "react-query";
import axios from "axios";
import { getAxiosOptionsWithAuth } from "api/api-client";
import queryClient from "api/query-client";
import { ISector, ISectorFormFields } from "types/sector";

interface UpdateSectorMutationProps {
  newSector: ISectorFormFields;
  sectorId: number;
}

export const fetchSuperSectors = async () => {
  const { data } = await axios.get<ISector[]>(
    "/api/v1/sectors/super/",
    getAxiosOptionsWithAuth(),
  );
  return data;
};

export const fetchSuperSector = async (sectorId: number | undefined) => {
  if (!sectorId) {
    throw new Error("sectorId is required");
  }
  const { data } = await axios.get<ISector>(
    `/api/v1/sectors/super/${sectorId}/`,
    getAxiosOptionsWithAuth(),
  );
  return data;
};

export const useAddSuperSector = () => {
  return useMutation(
    (newSector: ISectorFormFields) =>
      axios.post(
        "/api/v1/sectors/super/",
        newSector,
        getAxiosOptionsWithAuth(),
      ),
    {
      onSuccess: () => {
        queryClient.invalidateQueries("superSectors");
      },
    },
  );
};

export const useDeleteSuperSector = () => {
  return useMutation(
    (id: number) =>
      axios.delete(`/api/v1/sectors/super/${id}/`, getAxiosOptionsWithAuth()),
    {
      onSuccess: (data, variables) => {
        queryClient.invalidateQueries(["superSectors", variables]);
      },
    },
  );
};

export const useUpdateSuperSector = () => {
  return useMutation(
    ({ sectorId, newSector }: UpdateSectorMutationProps) =>
      axios.put(
        `/api/v1/sectors/super/${sectorId}/`,
        newSector,
        getAxiosOptionsWithAuth(),
      ),
    {
      onSuccess: (data, variables) => {
        queryClient.invalidateQueries(["superSectors", variables.sectorId]);
      },
    },
  );
};

export function useSuperSectors() {
  return useQuery<ISector[], Error>("superSectors", fetchSuperSectors);
}

export function useSuperSector(sectorId: number | undefined) {
  return useQuery<ISector, Error>(
    ["superSectors", sectorId],
    () => fetchSuperSector(sectorId),
    {
      enabled: !!sectorId,
    },
  );
}

export default useSuperSectors;
