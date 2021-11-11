import { useCallback, useState } from "react";
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router";
import { message } from "antd";
import { MarketsContextType } from "contexts/markets";
import { useApi } from "hooks/use-api/use-api-hook";
import getRoute, { MARKETS_ROUTE } from "routes";
import { IMarket, IMarketFormFields } from "types/market";

export function useMarketsContext(): MarketsContextType {
  const [market, setMarket] = useState<IMarket | null>(null);
  const [markets, setMarkets] = useState<IMarket[] | []>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { t } = useTranslation();
  const history = useHistory();
  const {
    get: apiGet,
    post: apiPost,
    put: apiPut,
    delete: apiDelete
  } = useApi();
  const endpoint = "/api/v1/markets/";

  const getAll = useCallback(async () => {
    setIsLoading(true);
    const response = await apiGet(endpoint);
    if (response.error) {
      console.error(response);
    }
    setMarkets(response);
    setIsLoading(false);
  }, [apiGet]);

  const getById = useCallback(
    async (id: number) => {
      setIsLoading(true);
      const response = await apiGet(endpoint + id);
      if (response?.error) {
        console.error(response);
      }
      setMarket(response);
      setIsLoading(false);
    },
    [apiGet]
  );

  const create = async (newValues: IMarketFormFields) => {
    const response = await apiPost(endpoint, newValues);
    if (response?.error) {
      message.error({
        content: t(`Error ${response.statusCode}: Unable to create market`)
      });
    } else {
      setMarket(response);
      message.success({ content: t("Market has been created") });
      history.push(getRoute(MARKETS_ROUTE));
    }
    return response;
  };

  const deleteById = async (id: number) => {
    const response = await apiDelete(endpoint + id);
    if (response?.error) {
      message.error({
        content: t(`Error ${response.statusCode}: Unable to delete market`)
      });
    } else {
      setMarket(null);
      getAll();
      message.success({ content: t("Market has been deleted") });
    }
    return response;
  };

  const update = async (id: number, newValues: IMarketFormFields) => {
    const response = await apiPut(`${endpoint + id}/`, newValues);
    if (response?.error) {
      message.error({
        content: t(`Error ${response.statusCode}: Unable to update market`)
      });
    } else {
      getById(id);
      message.success({ content: t("Market has been updated") });
    }
    return response;
  };

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
