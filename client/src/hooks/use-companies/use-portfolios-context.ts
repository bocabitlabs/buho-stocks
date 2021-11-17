import { useCallback, useState } from "react";
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router";
import { message } from "antd";
import { PortfoliosContextType } from "contexts/portfolios";
import { useApi } from "hooks/use-api/use-api-hook";
import getRoute, { PORTFOLIOS_ROUTE } from "routes";
import { IPortfolio, IPortfolioFormFields } from "types/portfolio";

export function usePortfoliosContext(): PortfoliosContextType {
  const [portfolio, setPortfolio] = useState<IPortfolio | null>(null);
  const [portfolios, setPortfolios] = useState<IPortfolio[] | []>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { t } = useTranslation();
  const history = useHistory();
  const {
    get: apiGet,
    post: apiPost,
    put: apiPut,
    delete: apiDelete
  } = useApi();
  const endpoint = "/api/v1/portfolios/";

  const getAll = useCallback(async () => {
    setIsLoading(true);
    const response = await apiGet(endpoint);
    if (response.error) {
      console.error(response);
    }
    setPortfolios(response);
    setIsLoading(false);
  }, [apiGet]);

  const getById = useCallback(
    async (id: number) => {
      console.log(`Get portfolio id:${id}`);
      setIsLoading(true);
      const response = await apiGet(endpoint + id);
      if (response?.error) {
        console.error(response);
      }
      setPortfolio(response);
      setIsLoading(false);
    },
    [apiGet]
  );

  const create = async (newValues: IPortfolioFormFields) => {
    const response = await apiPost(endpoint, newValues);
    if (response?.error) {
      message.error({
        content: t(`Error ${response.statusCode}: Unable to create market`)
      });
    } else {
      setPortfolio(response);
      message.success({ content: t("Portfolio has been created") });
      history.push(getRoute(PORTFOLIOS_ROUTE));
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
      setPortfolio(null);
      getAll();
      message.success({ content: t("Portfolio has been deleted") });
    }
    return response;
  };

  const update = async (id: number, newValues: IPortfolioFormFields) => {
    const response = await apiPut(`${endpoint + id}/`, newValues);
    if (response?.error) {
      message.error({
        content: t(`Error ${response.statusCode}: Unable to update market`)
      });
    } else {
      getById(id);
      message.success({ content: t("Portfolio has been updated") });
    }
    return response;
  };

  return {
    isLoading,
    portfolio,
    portfolios,
    create,
    deleteById,
    getAll,
    getById,
    update
  };
}

export default usePortfoliosContext;
