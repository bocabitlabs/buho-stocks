import { useMutation, useQuery } from "react-query";
import axios from "axios";
import { getAxiosOptionsWithAuth } from "api/api-client";
import queryClient from "api/query-client";
import { IMarket, IMarketFormFields } from "types/market";

interface UpdateMarketMutationProps {
  newMarket: IMarketFormFields;
  marketId: number;
}

export const fetchMarkets = async () => {
  const { data } = await axios.get<IMarket[]>(
    "/api/v1/markets/",
    getAxiosOptionsWithAuth(),
  );
  return data;
};

export const fetchMarket = async (marketId: number | undefined) => {
  if (!marketId) {
    throw new Error("marketId is required");
  }
  const { data } = await axios.get<IMarket>(
    `/api/v1/markets/${marketId}/`,
    getAxiosOptionsWithAuth(),
  );
  return data;
};

export const useAddMarket = () => {
  return useMutation(
    (newMarket: IMarketFormFields) =>
      axios.post("/api/v1/markets/", newMarket, getAxiosOptionsWithAuth()),
    {
      onSuccess: () => {
        queryClient.invalidateQueries("markets");
      },
    },
  );
};

export const useDeleteMarket = () => {
  return useMutation(
    (id: number) =>
      axios.delete(`/api/v1/markets/${id}/`, getAxiosOptionsWithAuth()),
    {
      onSuccess: (data, variables) => {
        queryClient.invalidateQueries(["markets", variables]);
      },
    },
  );
};

export const useUpdateMarket = () => {
  return useMutation(
    ({ marketId, newMarket }: UpdateMarketMutationProps) =>
      axios.put(
        `/api/v1/markets/${marketId}/`,
        newMarket,
        getAxiosOptionsWithAuth(),
      ),
    {
      onSuccess: (data, variables) => {
        queryClient.invalidateQueries(["markets", variables.marketId]);
      },
    },
  );
};

export function useMarkets() {
  return useQuery<IMarket[], Error>("markets", fetchMarkets);
}

export function useMarket(marketId: number | undefined) {
  return useQuery<IMarket, Error>(
    ["markets", marketId],
    () => fetchMarket(marketId),
    {
      enabled: !!marketId,
    },
  );
}

export default useMarkets;
