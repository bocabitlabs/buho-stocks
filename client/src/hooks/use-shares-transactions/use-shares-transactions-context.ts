import { useCallback, useState } from "react";
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router";
import { message } from "antd";
import { SharesTransactionsContextType } from "contexts/shares-transactions";
import { useApi } from "hooks/use-api/use-api-hook";
import getRoute, { COMPANIES_DETAILS_ROUTE } from "routes";
import {
  ISharesTransaction,
  ISharesTransactionFormFields
} from "types/shares-transaction";

export function useSharesTransactionsContext(
  companyId: string
): SharesTransactionsContextType {
  const [transaction, setTransaction] = useState<ISharesTransaction | null>(
    null
  );
  const [transactions, setTransactions] = useState<ISharesTransaction[] | []>(
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
  const endpoint = `/api/v1/companies/${companyId}/shares/`;

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

  const create = async (newValues: ISharesTransactionFormFields) => {
    const response = await apiPost(endpoint, newValues);
    if (response?.error) {
      message.error({
        content: t(
          `Error ${response.statusCode}: Unable to create the shares transaction`
        )
      });
    } else {
      setTransaction(response);
      message.success({ content: t("Shares transaction has been created") });
      history.push(
        getRoute(COMPANIES_DETAILS_ROUTE)
          .replace(":id", newValues.portfolio.toString())
          .replace(":companyId", newValues.company.toString())
      );
    }
    return response;
  };

  const deleteById = async (id: number) => {
    const response = await apiDelete(endpoint + id);
    if (response?.error) {
      message.error({
        content: t(`Error ${response.statusCode}: Unable to delete company`)
      });
    } else {
      setTransaction(null);
      getAll();
      message.success({ content: t("Company has been deleted") });
    }
    return response;
  };

  const update = async (
    id: number,
    newValues: ISharesTransactionFormFields
  ) => {
    const response = await apiPut(`${endpoint + id}/`, newValues);
    if (response?.error) {
      message.error({
        content: t(`Error ${response.statusCode}: Unable to update company`)
      });
    } else {
      getById(id);
      message.success({ content: t("Company has been updated") });
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

export default useSharesTransactionsContext;
