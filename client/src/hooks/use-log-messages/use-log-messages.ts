import { useMutation, useQuery } from "react-query";
import { apiClient } from "api/api-client";
import queryClient from "api/query-client";
import { ILogMessage } from "types/log-messages";

interface DeleteMutationProps {
  portfolioId: number | undefined;
  logMessageId: number | undefined;
}

export const fetchLogMessages = async (portfolioId: number | undefined) => {
  console.log(`fetchLogMessages from portfolioId: ${portfolioId}`);
  const { data } = await apiClient.get<ILogMessage[]>(
    `/portfolios/${portfolioId}/messages/`,
  );
  return data;
};

export const useDeleteLogMessages = () => {
  return useMutation(
    ({ portfolioId, logMessageId }: DeleteMutationProps) =>
      apiClient.delete(`/portfolios/${portfolioId}/messages/${logMessageId}`),
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
