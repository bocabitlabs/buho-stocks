import { useTranslation } from "react-i18next";
import { useMutation, useQuery } from "react-query";
import { toast } from "react-toastify";
import { apiClient } from "api/api-client";
import queryClient from "api/query-client";
import {
  IStockPrice,
  IStockPriceFormFields,
  IStockPriceListResponse,
} from "types/stock-prices";

interface IUpdateYearStatsMutationProps {
  companyId: number | undefined;
  year: string | undefined;
}

interface UpdateMutationProps {
  newStockPrice: IStockPriceFormFields;
  id: number | undefined;
}

export const fetchExchangeRates = async (
  page: number = 1,
  pageSize: number = 100,
  sortBy: string = "transactionDate",
  orderBy: string = "descend",
) => {
  const sortValidValues = [
    "transactionDate",
    "price",
    "priceCurrency",
    "ticker",
  ];

  const orderValidValues = ["ascend", "descend"];

  if (!sortValidValues.includes(sortBy)) {
    throw new Error("sortBy is invalid");
  }

  let newOrderBy = orderBy;
  if (!orderBy) {
    newOrderBy = "descend";
  }
  if (!orderValidValues.includes(newOrderBy)) {
    throw new Error("orderBy is invalid");
  }

  const parsedSortByValues: any = {
    transactionDate: "transaction_date",
    price: "price",
    priceCurrency: "price_currency",
    ticker: "ticker",
  };

  const newSortBy = parsedSortByValues[sortBy];

  const parsedOrderByValues: any = {
    ascend: "asc",
    descend: "desc",
  };

  newOrderBy = parsedOrderByValues[newOrderBy];

  const { data } = await apiClient.get<IStockPriceListResponse>(
    `/stock-prices/?page=${page}&page_size=${pageSize}&sort_by=${newSortBy}&order_by=${newOrderBy}`,
  );
  return data;
};

export function useStockPrices(
  page: number,
  pageSize: number,
  sortBy: string,
  orderBy: string,
) {
  return useQuery<IStockPriceListResponse, Error>(
    ["stock-prices", page, pageSize, sortBy, orderBy],
    () => fetchExchangeRates(page, pageSize, sortBy, orderBy),
  );
}

export const fetchStockPrice = async (id: number | undefined) => {
  if (!id) {
    throw new Error("id is required");
  }
  const { data } = await apiClient.get<IStockPrice>(`/stock-prices/${id}/`);
  return data;
};

export function useStockPrice(id: number | undefined) {
  return useQuery<IStockPrice, Error>(
    ["stock-prices", id],
    () => fetchStockPrice(id),
    {
      enabled: !!id,
    },
  );
}

export const useUpdateCompanyStockPrice = () => {
  return useMutation(
    ({ companyId, year }: IUpdateYearStatsMutationProps) =>
      apiClient.put(`/companies/${companyId}/stock-prices/${year}/`, {}),
    {
      onSuccess: (data, variables) => {
        queryClient.invalidateQueries([
          "companyYearStats",
          variables.companyId,
          variables.year,
        ]);
      },
    },
  );
};

export const useAddStockPrice = () => {
  const { t } = useTranslation();

  return useMutation(
    (newExchangeRate: IStockPriceFormFields) =>
      apiClient.post(`/stock-prices/`, newExchangeRate),
    {
      onSuccess: () => {
        toast.success<string>(t("Stock price created"));
        queryClient.invalidateQueries(["stock-prices"]);
      },
      onError: () => {
        toast.error<string>(t("Unable to create stock price"));
        queryClient.invalidateQueries(["stock-prices"]);
      },
    },
  );
};

export const useDeleteStockPrice = () => {
  const { t } = useTranslation();

  return useMutation((id: number) => apiClient.delete(`/stock-prices/${id}/`), {
    onSuccess: () => {
      toast.success<string>(t("Stock price deleted"));
      queryClient.invalidateQueries(["stock-prices"]);
    },
    onError: () => {
      toast.error<string>(t("Unable to delete stock price"));
      queryClient.invalidateQueries(["stock-prices"]);
    },
  });
};

export const useUpdateStockPrice = () => {
  const { t } = useTranslation();

  return useMutation(
    ({ id, newStockPrice }: UpdateMutationProps) =>
      apiClient.put(`/stock-prices/${id}/`, newStockPrice),
    {
      onSuccess: () => {
        toast.success<string>(t("Stock price has been updated"));
        queryClient.invalidateQueries(["stock-prices"]);
      },
      onError: () => {
        toast.error<string>(t("Unable to update stock price"));
        queryClient.invalidateQueries(["stock-prices"]);
      },
    },
  );
};

export default useUpdateCompanyStockPrice;
