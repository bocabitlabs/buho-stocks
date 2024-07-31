import { keepPreviousData, useMutation, useQuery } from "@tanstack/react-query";
import { MRT_PaginationState } from "mantine-react-table";
import { apiClient } from "api/api-client";
import queryClient from "api/query-client";
import { ILogMessage } from "types/log-messages";

interface DeleteMutationProps {
  portfolioId: number | undefined;
  logMessageId: number | undefined;
}

type LogMessagesApiResponse = {
  results: Array<ILogMessage>;
  count: number;
  next: number | null;
  previous: number | null;
};

// interface Params {
//   pagination?: MRT_PaginationState;
// }

export const fetchLogMessages = async (
  portfolioId: number | undefined,
  pagination: MRT_PaginationState | undefined,
) => {
  // const { data } = await apiClient.get<ILogMessage[]>(
  //   `/portfolios/${portfolioId}/messages/`,
  // );
  const fetchURL = new URL(
    `/api/v1/portfolios/${portfolioId}/messages/`,
    apiClient.defaults.baseURL,
  );
  if (pagination) {
    fetchURL.searchParams.set(
      "offset",
      `${pagination.pageIndex * pagination.pageSize}`,
    );
    fetchURL.searchParams.set("limit", `${pagination.pageSize}`);
  }
  const { data } = await apiClient.get<LogMessagesApiResponse>(fetchURL.href);
  return data;
};

export const useDeleteLogMessages = () => {
  return useMutation({
    mutationFn: ({ portfolioId, logMessageId }: DeleteMutationProps) =>
      apiClient.delete(`/portfolios/${portfolioId}/messages/${logMessageId}`),

    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["logMessages", variables.portfolioId],
      });
    },
  });
};

export function useLogMessages(
  portfolioId: number | undefined,
  pagination?: MRT_PaginationState,
) {
  return useQuery<LogMessagesApiResponse, Error>({
    queryKey: ["logMessages", portfolioId, pagination],
    queryFn: () => fetchLogMessages(portfolioId, pagination),
    placeholderData: keepPreviousData, // useful for paginated queries by keeping data from previous pages on screen while fetching the next page
    staleTime: 30_000, // don't refetch previously viewed pages until cache is more than 30 seconds old
    enabled: !!portfolioId,
  });
}
