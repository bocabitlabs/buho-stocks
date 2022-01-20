import { useMutation, useQuery } from "react-query";
import axios from "axios";
import { getAxiosOptionsWithAuth } from "api/api-client";
import queryClient from "api/query-client";
import { ILogMessage } from "types/log-messages";

interface DeleteMutationProps {
  portfolioId: number | undefined;
  logMessageId: number | undefined;
}

export const fetchLogMessages = async (portfolioId: number | undefined) => {
  console.log(`fetchLogMessages from portfolioId: ${portfolioId}`);
  const { data } = await axios.get<ILogMessage[]>(
    `/api/v1/portfolios/${portfolioId}/messages/`,
    getAxiosOptionsWithAuth(),
  );
  return data;
};

export const useDeleteLogMessages = () => {
  return useMutation(
    ({ portfolioId, logMessageId }: DeleteMutationProps) =>
      axios.delete(
        `/api/v1/portfolios/${portfolioId}/messages/${logMessageId}`,
        getAxiosOptionsWithAuth(),
      ),
    {
      onSuccess: (data, variables) => {
        queryClient.invalidateQueries(["messages", variables.portfolioId]);
      },
    },
  );
};

export function useLogMessages(portfolioId: number | undefined) {
  return useQuery<ILogMessage[], Error>(
    ["logMessages", portfolioId],
    () => fetchLogMessages(portfolioId),
    {
      enabled: !!portfolioId,
    },
  );
}
