import { message } from "antd";
import { MarketsContextType } from "contexts/markets";
import { useCallback, useState } from "react";
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router";
import getRoute, { MARKETS_ROUTE } from "routes";
import MarketService from "services/markets/markets-service";
import { IMarket, IMarketFormFields } from "types/market";

export function useMarketsContext(): MarketsContextType {
  const [market, setMarket] = useState<IMarket | null>(null);
  const [markets, setMarkets] = useState<IMarket[] | []>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { t } = useTranslation();
  const history = useHistory();

  const getAll = useCallback(async () => {
    setIsLoading(true);
    const response = await MarketService.getAll();
    if (response.error) {
      return response;
    }
    console.log(response);
    setMarkets(response.result);
    setIsLoading(false);
  }, []);

  const create = async (newValues: IMarketFormFields) => {
    console.log("CREATE");
    const response = await MarketService.create(newValues);
    if (response?.error) {
      message.error({
        content: t(`Error ${response.statusCode}: Unable to create market`)
      });
    } else {
      setMarket(response.result);
      message.success({ content: t("Market has been created") });
    }
    history.push(getRoute(MARKETS_ROUTE));
    return response;
  };

  const deleteById = async (id: number) => {
    const response = await MarketService.deleteById(id);
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

  return {
    isLoading,
    market,
    markets,
    create,
    deleteById,
    getAll,
  };
}
