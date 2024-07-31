import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import { keepPreviousData, useMutation, useQuery } from "@tanstack/react-query";
import { MRT_PaginationState, MRT_SortingState } from "mantine-react-table";
import { apiClient } from "api/api-client";
import queryClient from "api/query-client";
import { IStockPrice, IStockPriceFormFields } from "types/stock-prices";

interface IUpdateYearStatsMutationProps {
  companyId: number | undefined;
  year: string | undefined;
}

interface UpdateMutationProps {
  newStockPrice: IStockPriceFormFields;
  id: number | undefined;
}

type StockPriceApiResponse = {
  results: Array<IStockPrice>;
  count: number;
  next: number | null;
  previous: number | null;
};

interface Params {
  sorting: MRT_SortingState;
  pagination: MRT_PaginationState;
}

export const fetchStockPrices = async (
  pagination: MRT_PaginationState,
  sorting: MRT_SortingState,
) => {
  const fetchURL = new URL("/api/v1/stock-prices/", apiClient.defaults.baseURL);
  if (pagination) {
    fetchURL.searchParams.set(
      "offset",
      `${pagination.pageIndex * pagination.pageSize}`,
    );
    fetchURL.searchParams.set("limit", `${pagination.pageSize}`);
  }

  if (sorting?.length === 0) {
    fetchURL.searchParams.set("sort_by", "transactionDate");
    fetchURL.searchParams.set("order_by", "asc");
  } else {
    const newSortBy = sorting?.[0].id ?? "transactionDate";
    fetchURL.searchParams.set("sort_by", newSortBy);
    const newOrderBy = sorting?.[0].desc ? "desc" : "asc";
    fetchURL.searchParams.set("order_by", newOrderBy);
  }

  const { data } = await apiClient.get<StockPriceApiResponse>(fetchURL.href);

  return data;
};

export function useStockPrices({ sorting, pagination }: Params) {
  return useQuery<StockPriceApiResponse, Error>({
    queryKey: ["stock-prices", pagination, sorting],
    queryFn: () => fetchStockPrices(pagination, sorting),
    placeholderData: keepPreviousData, // useful for paginated queries by keeping data from previous pages on screen while fetching the next page
    staleTime: 30_000, // don't refetch previously viewed pages until cache is more than 30 seconds old
  });
}

export const fetchStockPrice = async (id: number | undefined) => {
  if (!id) {
    throw new Error("id is required");
  }
  const { data } = await apiClient.get<IStockPrice>(`/stock-prices/${id}/`);
  return data;
};

export function useStockPrice(id: number | undefined) {
  return useQuery<IStockPrice, Error>({
    queryKey: ["stock-prices", id],
    queryFn: () => fetchStockPrice(id),
    enabled: !!id,
  });
}

export const useUpdateCompanyStockPrice = () => {
  return useMutation({
    mutationFn: ({ companyId, year }: IUpdateYearStatsMutationProps) =>
      apiClient.put(`/companies/${companyId}/stock-prices/${year}/`, {}),

    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["companyYearStats", variables.companyId, variables.year],
      });
    },
  });
};

interface MutateProps {
  onSuccess?: Function;
  onError?: Function;
}

export const useAddStockPrice = (props?: MutateProps) => {
  const { t } = useTranslation();

  return useMutation({
    mutationFn: (newExchangeRate: IStockPriceFormFields) =>
      apiClient.post(`/stock-prices/`, newExchangeRate),

    onSuccess: () => {
      props?.onSuccess?.();

      toast.success<string>(t("Stock price created"));
      queryClient.invalidateQueries({ queryKey: ["stock-prices"] });
    },
    onError: () => {
      props?.onError?.();
      toast.error<string>(t("Unable to create stock price"));
    },
  });
};

export const useDeleteStockPrice = () => {
  const { t } = useTranslation();

  return useMutation({
    mutationFn: (id: number) => apiClient.delete(`/stock-prices/${id}/`),
    onSuccess: () => {
      toast.success<string>(t("Stock price deleted"));
      queryClient.invalidateQueries({ queryKey: ["stock-prices"] });
    },
    onError: () => {
      toast.error<string>(t("Unable to delete stock price"));
    },
  });
};

export const useUpdateStockPrice = (props?: MutateProps) => {
  const { t } = useTranslation();

  return useMutation({
    mutationFn: ({ id, newStockPrice }: UpdateMutationProps) =>
      apiClient.put(`/stock-prices/${id}/`, newStockPrice),

    onSuccess: () => {
      props?.onSuccess?.();
      toast.success<string>(t("Stock price has been updated"));
      queryClient.invalidateQueries({ queryKey: ["stock-prices"] });
    },
    onError: () => {
      props?.onError?.();
      toast.error<string>(t("Unable to update stock price"));
    },
  });
};

export default useUpdateCompanyStockPrice;
