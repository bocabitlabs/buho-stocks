import { useTranslation } from "react-i18next";
import { useMutation, useQuery } from "react-query";
import { toast } from "react-toastify";
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

export const useAddMarket = (options?: any) => {
  const { t } = useTranslation();

  return useMutation(
    (newMarket: IMarketFormFields) =>
      axios.post("/api/v1/markets/", newMarket, getAxiosOptionsWithAuth()),
    {
      onSuccess: () => {
        toast.success(t("Market created"));
        queryClient.invalidateQueries("markets");
      },
      onError: (error: any) => {
        toast.error(t(`Cannot create market: ${error}`));
      },
      ...options,
    },
  );
};

export const useDeleteMarket = () => {
  return useMutation(
    (id: number) =>
      axios.delete(`/api/v1/markets/${id}/`, getAxiosOptionsWithAuth()),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["markets"]);
      },
    },
  );
};

export const useUpdateMarket = (options?: any) => {
  const { t } = useTranslation();

  return useMutation(
    ({ marketId, newMarket }: UpdateMarketMutationProps) =>
      axios.put(
        `/api/v1/markets/${marketId}/`,
        newMarket,
        getAxiosOptionsWithAuth(),
      ),
    {
      onSuccess: () => {
        toast.success(t("Market has been updated"));
        queryClient.invalidateQueries(["markets"]);
      },
      onError: (error: any) => {
        toast.error(t(`Cannot update market: ${error}`));
      },
      ...options,
    },
  );
};

export function useMarkets() {
  return useQuery<IMarket[], Error>("markets", fetchMarkets);
}

export function useMarket(marketId: number | undefined, options?: any) {
  return useQuery<IMarket, Error>(
    ["markets", marketId],
    () => fetchMarket(marketId),
    {
      enabled: !!marketId,
      ...options,
    },
  );
}

export default useMarkets;
