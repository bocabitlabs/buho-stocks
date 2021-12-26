import { useCallback, useState } from "react";
import useFetch from "use-http";
import { LogMessagesContextType } from "contexts/log-messages";
import { ILogMessage } from "types/log-messages";

export function useLogMessagesContext(
  portfolioId: string
): LogMessagesContextType {
  const [logMessage, setLogMessage] = useState<ILogMessage | null>(null);
  const [logMessages, setLogMessages] = useState<ILogMessage[] | []>([]);
  const endpoint = `/api/v1/portfolios/${portfolioId}/log-messages/`;
  const getHeaders = useCallback(() => {
    const headers = {
      Accept: "application/json",
      Authorization: `Token ${localStorage.getItem("token")}`
    };
    return headers;
  }, []);
  const {
    get,
    response,
    error,
    del: deleteRequest,
    loading: isLoading
  } = useFetch(endpoint, {
    headers: getHeaders()
  });

  const getAll = useCallback(async () => {
    const responseValues = await get();
    if (response.ok) {
      setLogMessages(responseValues);
    } else {
      console.error(error);
    }
  }, [get, response, error]);

  const getById = useCallback(
    async (id: number) => {
      const responseValues = await get(`${id}/`);
      if (response.ok) {
        setLogMessage(responseValues);
      } else {
        console.error(error);
      }
    },
    [get, response, error]
  );

  const deleteById = useCallback(
    async (id: number) => {
      await deleteRequest(`${id}/`);
      if (response.ok) {
        setLogMessage(null);
      } else {
        console.error(error);
      }
      return response;
    },
    [deleteRequest, response, error]
  );

  return {
    isLoading,
    logMessage,
    logMessages,
    deleteById,
    getAll,
    getById
  };
}

export default useLogMessagesContext;
