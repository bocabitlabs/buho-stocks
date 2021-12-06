import { useCallback, useState } from "react";
import { useTranslation } from "react-i18next";
import { message } from "antd";
import { LogMessagesContextType } from "contexts/log-messages";
import { useApi } from "hooks/use-api/use-api-hook";
import { ILogMessage } from "types/log-messages";

export function useLogMessagesContext(
  portfolioId: string
): LogMessagesContextType {
  const [logMessage, setLogMessage] = useState<ILogMessage | null>(null);
  const [logMessages, setLogMessages] = useState<ILogMessage[] | []>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { t } = useTranslation();
  const {
    get: apiGet,
    // post: apiPost,
    // put: apiPut,
    delete: apiDelete
  } = useApi();
  const endpoint = `/api/v1/portfolios/${portfolioId}/log-messages/`;

  const getAll = useCallback(async () => {
    setIsLoading(true);
    const response = await apiGet(endpoint);
    if (response.error) {
      console.error(response);
    }
    setLogMessages(response);
    setIsLoading(false);
  }, [apiGet, endpoint]);

  const getById = useCallback(
    async (id: number) => {
      setIsLoading(true);
      const response = await apiGet(endpoint + id);
      if (response?.error) {
        console.error(response);
      }
      setLogMessage(response);
      setIsLoading(false);
    },
    [apiGet, endpoint]
  );

  // const create = async (newValues: ILogMessageFormFields) => {
  //   const response = await apiPost(endpoint, newValues);
  //   if (response?.error) {
  //     message.error({
  //       content: t(`Error ${response.statusCode}: Unable to create message`)
  //     });
  //   } else {
  //     setLogMessages(response);
  //   }
  //   return response;
  // };

  const deleteById = async (id: number) => {
    const response = await apiDelete(endpoint + id);
    if (response?.error) {
      message.error({
        content: t(`Error ${response.statusCode}: Unable to delete message`)
      });
    } else {
      setLogMessage(null);
      getAll();
      message.success({ content: t("Message has been deleted") });
    }
    return response;
  };

  // const update = async (id: number, newValues: ILogMessageFormFields) => {
  //   const response = await apiPut(`${endpoint + id}/`, newValues);
  //   if (response?.error) {
  //     message.error({
  //       content: t(`Error ${response.statusCode}: Unable to update message`)
  //     });
  //   } else {
  //     getById(id);
  //     message.success({ content: t("Message has been updated") });
  //   }
  //   return response;
  // };

  return {
    isLoading,
    logMessage,
    logMessages,
    // create,
    deleteById,
    getAll,
    getById
    // update
  };
}

export default useLogMessagesContext;
