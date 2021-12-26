import { useCallback, useState } from "react";
import useFetch from "use-http";
import { MarketsContextType } from "contexts/markets";
import { IMarket, IMarketFormFields } from "types/market";

export function useMarketsContext(): MarketsContextType {
  const [market, setMarket] = useState<IMarket | null>(null);
  const [markets, setMarkets] = useState<IMarket[] | []>([]);

  const endpoint = "/api/v1/markets/";
  const getHeaders = useCallback(() => {
    const headers = {
      Accept: "application/json",
      Authorization: `Token ${localStorage.getItem("token")}`
    };
    return headers;
  }, []);

  const {
    get,
    post,
    put,
    cache,
    del: deleteRequest,
    error,
    response,
    loading: isLoading
  } = useFetch(endpoint, {
    headers: getHeaders()
  });

  const getAll = useCallback(async () => {
    const responseValues = await get();
    if (response.ok) {
      setMarkets(responseValues);
    } else {
      console.error(error);
    }
    return response;
  }, [get, response, error]);

  const getById = useCallback(
    async (id: number) => {
      const responseValues = await get(`${id}/`);
      if (response.ok) {
        setMarket(responseValues);
      } else {
        console.error(error);
      }
      return response;
    },
    [get, response, error]
  );

  const create = useCallback(
    async (newValues: IMarketFormFields) => {
      const responseValues = await post(newValues);
      if (response.ok) {
        setMarket(responseValues);
        cache.clear();
      } else {
        console.error(error);
      }
      return response;
    },
    [post, response, error, cache]
  );

  const deleteById = useCallback(
    async (id: number) => {
      await deleteRequest(`${id}/`);
      if (response.ok) {
        setMarket(null);
        cache.clear();
      } else {
        console.error(error);
      }
      return response;
    },
    [deleteRequest, response, error, cache]
  );

  const update = useCallback(
    async (id: number, newValues: IMarketFormFields) => {
      const responseValues = await put(`${id}/`, newValues);
      if (response.ok) {
        setMarket(responseValues);
        cache.clear();
      } else {
        console.error(error);
      }
      return response;
    },
    [put, response, error, cache]
  );

  return {
    isLoading,
    market,
    markets,
    create,
    deleteById,
    getAll,
    getById,
    update
  };
}

export default useMarketsContext;
