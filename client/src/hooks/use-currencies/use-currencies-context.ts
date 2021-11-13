import { useCallback, useState } from "react";
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router";
import { message } from "antd";
import { CurrenciesContextType } from "contexts/currencies";
import { useApi } from "hooks/use-api/use-api-hook";
import getRoute, { CURRENCIES_ROUTE } from "routes";
import { ICurrency, ICurrencyFormFields } from "types/currency";

export function useCurrenciesContext(): CurrenciesContextType {
  const [currency, setCurrency] = useState<ICurrency | null>(null);
  const [currencies, setCurrencies] = useState<ICurrency[] | []>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { t } = useTranslation();
  const history = useHistory();
  const {
    get: apiGet,
    post: apiPost,
    put: apiPut,
    delete: apiDelete
  } = useApi();
  const endpoint = "/api/v1/currencies/";

  const getAll = useCallback(async () => {
    setIsLoading(true);
    const response = await apiGet(endpoint);
    if (response.error) {
      console.error(response);
    }
    setCurrencies(response);
    setIsLoading(false);
  }, [apiGet]);

  const getById = useCallback(
    async (id: number) => {
      setIsLoading(true);
      const response = await apiGet(endpoint + id);
      if (response?.error) {
        console.error(response);
      }
      setCurrency(response);
      setIsLoading(false);
    },
    [apiGet]
  );

  const create = async (newValues: ICurrencyFormFields) => {
    const response = await apiPost(endpoint, newValues);
    if (response?.error) {
      message.error({
        content: t(`Error ${response.statusCode}: Unable to create currency`)
      });
    } else {
      setCurrency(response);
      message.success({ content: t("Currency has been created") });
      history.push(getRoute(CURRENCIES_ROUTE));
    }
    return response;
  };

  const deleteById = async (id: number) => {
    const response = await apiDelete(endpoint + id);
    if (response?.error) {
      message.error({
        content: t(`Error ${response.statusCode}: Unable to delete currency`)
      });
    } else {
      setCurrency(null);
      getAll();
      message.success({ content: t("Currency has been deleted") });
    }
    return response;
  };

  const update = async (id: number, newValues: ICurrencyFormFields) => {
    const response = await apiPut(`${endpoint + id}/`, newValues);
    if (response?.error) {
      message.error({
        content: t(`Error ${response.statusCode}: Unable to update currency`)
      });
    } else {
      getById(id);
      message.success({ content: t("Currency has been updated") });
    }
    return response;
  };

  return {
    isLoading,
    currency,
    currencies,
    create,
    deleteById,
    getAll,
    getById,
    update
  };
}

export default useCurrenciesContext;
