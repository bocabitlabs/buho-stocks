import { useCallback, useState } from "react";
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router";
import { message } from "antd";
import { SharesTransactionsContextType } from "contexts/shares-transactions";
import { useApi } from "hooks/use-api/use-api-hook";
import getRoute, { COMPANIES_DETAILS_ROUTE } from "routes";
import {
  IRightsTransaction,
  IRightsTransactionFormFields
} from "types/rights-transaction";

export function useRightsTransactionsContext(
  companyId: string
): SharesTransactionsContextType {
  const [transaction, setTransaction] = useState<IRightsTransaction | null>(
    null
  );
  const [transactions, setTransactions] = useState<IRightsTransaction[] | []>(
    []
  );
  const [isLoading, setIsLoading] = useState(false);
  const { t } = useTranslation();
  const history = useHistory();
  const {
    get: apiGet,
    post: apiPost,
    put: apiPut,
    delete: apiDelete
  } = useApi();
  const endpoint = `/api/v1/companies/${companyId}/rights/`;

  const getAll = useCallback(async () => {
    setIsLoading(true);
    const response = await apiGet(endpoint);
    if (response.error) {
      console.error(response);
    }
    setTransactions(response);
    setIsLoading(false);
  }, [apiGet, endpoint]);

  const getById = useCallback(
    async (id: number) => {
      setIsLoading(true);
      const response = await apiGet(endpoint + id);
      if (response?.error) {
        console.error(response);
      }
      setTransaction(response);
      setIsLoading(false);
    },
    [apiGet, endpoint]
  );

  const create = async (newValues: IRightsTransactionFormFields) => {
    const response = await apiPost(endpoint, newValues);
    if (response?.error) {
      message.error({
        content: t(
          `Error ${response.statusCode}: Unable to create the rights transaction`
        )
      });
    } else {
      setTransaction(response);
      message.success({ content: t("Rights transaction has been created") });
      history.push(
        `${getRoute(COMPANIES_DETAILS_ROUTE)
          .replace(":id", newValues.portfolio.toString())
          .replace(":companyId", newValues.company.toString())}?tab=rights`
      );
    }
    return response;
  };

  const deleteById = async (id: number) => {
    const response = await apiDelete(endpoint + id);
    if (response?.error) {
      message.error({
        content: t(`Error ${response.statusCode}: Unable to delete transaction`)
      });
    } else {
      setTransaction(null);
      getAll();
      message.success({ content: t("Transaction has been deleted") });
    }
    return response;
  };

  const update = async (
    id: number,
    newValues: IRightsTransactionFormFields
  ) => {
    const response = await apiPut(`${endpoint + id}/`, newValues);
    if (response?.error) {
      message.error({
        content: t(`Error ${response.statusCode}: Unable to update transaction`)
      });
    } else {
      getById(id);
      message.success({ content: t("Transaction has been updated") });
    }
    return response;
  };

  return {
    isLoading,
    transaction,
    transactions,
    create,
    deleteById,
    getAll,
    getById,
    update
  };
}

export default useRightsTransactionsContext;
