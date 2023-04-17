import { useTranslation } from "react-i18next";
import { useMutation, useQuery } from "react-query";
import { toast } from "react-toastify";
import { apiClient } from "api/api-client";
import queryClient from "api/query-client";
import {
  IExchangeRate,
  IExchangeRateFormFields,
  IExchangeRateListResponse,
} from "types/exchange-rate";

interface UpdateMutationProps {
  newExchangeRate: IExchangeRateFormFields;
  id: number | undefined;
}

export const fetchExchangeRate = async (
  fromCurrencyCode: string | undefined,
  toCurrencyCode: string | undefined,
  transactionDate: string | undefined,
) => {
  if (!fromCurrencyCode || !toCurrencyCode || !transactionDate) {
    throw new Error(
      "fromCurrencyCode, toCurrencyCode and transactionDate are required",
    );
  }
  console.log("Making exchange-rates call");
  const { data } = await apiClient.get<IExchangeRate>(
    `/exchange-rates/${fromCurrencyCode}/${toCurrencyCode}/${transactionDate}/`,
  );
  return data;
};

export function useExchangeRate(
  fromCurrencyCode: string | undefined,
  toCurrencyCode: string | undefined,
  transactionDate: string | undefined,
) {
  return useQuery<IExchangeRate, Error>(
    ["exchange-rates", fromCurrencyCode, toCurrencyCode, transactionDate],
    () => fetchExchangeRate(fromCurrencyCode, toCurrencyCode, transactionDate),
    {
      enabled: false,
      useErrorBoundary: false,
    },
  );
}

export const fetchExchangeRates = async (
  page: number = 1,
  pageSize: number = 100,
  sortBy: string = "exchangeDate",
  orderBy: string = "descend",
) => {
  const sortValidValues = [
    "exchangeDate",
    "exchangeRate",
    "exchangeFrom",
    "exchangeTo",
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
    exchangeDate: "exchange_date",
    exchangeRate: "exchange_rate",
    exchangeFrom: "exchange_from",
    exchangeTo: "exchange_to",
  };

  const newSortBy = parsedSortByValues[sortBy];

  const parsedOrderByValues: any = {
    ascend: "asc",
    descend: "desc",
  };

  newOrderBy = parsedOrderByValues[newOrderBy];

  const { data } = await apiClient.get<IExchangeRateListResponse>(
    `/exchange-rates/?page=${page}&page_size=${pageSize}&sort_by=${newSortBy}&order_by=${newOrderBy}`,
  );
  return data;
};

export function useExchangeRates(
  page: number,
  pageSize: number,
  sortBy: string,
  orderBy: string,
) {
  return useQuery<IExchangeRateListResponse, Error>(
    ["exchange-rates", page, pageSize, sortBy, orderBy],
    () => fetchExchangeRates(page, pageSize, sortBy, orderBy),
  );
}

export const fetchExchangeRateDetails = async (id: number | undefined) => {
  if (!id) {
    throw new Error("id is required");
  }
  const { data } = await apiClient.get<IExchangeRate>(`/exchange-rates/${id}/`);
  return data;
};

export function useExchangeRateDetails(id: number | undefined) {
  return useQuery<IExchangeRate, Error>(
    ["exchange-rates", id],
    () => fetchExchangeRateDetails(id),
    {
      enabled: !!id,
    },
  );
}

export const useAddExchangeRate = () => {
  const { t } = useTranslation();

  return useMutation(
    (newExchangeRate: IExchangeRateFormFields) =>
      apiClient.post(`/exchange-rates/`, newExchangeRate),
    {
      onSuccess: () => {
        toast.success<string>(t("Exchange rate created"));
        queryClient.invalidateQueries(["exchange-rates"]);
      },
      onError: () => {
        toast.error<string>(t("Unable to create exchange rate"));
        queryClient.invalidateQueries(["exchange-rates"]);
      },
    },
  );
};

export const useDeleteExchangeRate = () => {
  const { t } = useTranslation();

  return useMutation(
    (id: number) => apiClient.delete(`/exchange-rates/${id}/`),
    {
      onSuccess: () => {
        toast.success<string>(t("Exchange rate deleted"));
        queryClient.invalidateQueries(["exchange-rates"]);
      },
      onError: () => {
        toast.error<string>(t("Unable to delete exchange rate"));
        queryClient.invalidateQueries(["exchange-rates"]);
      },
    },
  );
};

export const useUpdateExchangeRate = () => {
  const { t } = useTranslation();

  return useMutation(
    ({ id, newExchangeRate }: UpdateMutationProps) =>
      apiClient.put(`/exchange-rates/${id}/`, newExchangeRate),
    {
      onSuccess: () => {
        toast.success<string>(t("ExchangeRate has been updated"));
        queryClient.invalidateQueries(["exchange-rates"]);
      },
      onError: () => {
        toast.error<string>(t("Unable to update exchange rate"));
        queryClient.invalidateQueries(["exchange-rates"]);
      },
    },
  );
};
