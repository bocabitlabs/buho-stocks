import { useTranslation } from "react-i18next";
import { useMutation, useQuery } from "react-query";
import { toast } from "react-toastify";
import { apiClient } from "api/api-client";
import queryClient from "api/query-client";
import { ICurrency, ICurrencyFormFields } from "types/currency";

interface UpdateMutationProps {
  newCurrency: ICurrencyFormFields;
  id: number | undefined;
}

export const fetchCurrencies = async () => {
  const { data } = await apiClient.get<ICurrency[]>("/currencies/");
  return data;
};
export function useCurrencies() {
  return useQuery<ICurrency[], Error>("currencies", fetchCurrencies);
}

export const fetchCurrency = async (id: number | undefined) => {
  if (!id) {
    throw new Error("Id is required");
  }
  const { data } = await apiClient.get<ICurrency>(`/currencies/${id}/`);
  return data;
};

export function useCurrency(id: number | undefined, options?: any) {
  return useQuery<ICurrency, Error>(
    ["currencies", id],
    () => fetchCurrency(id),
    {
      enabled: !!id,
      ...options,
    },
  );
}

export const useAddCurrency = () => {
  const { t } = useTranslation();

  return useMutation(
    (newCurrency: ICurrencyFormFields) =>
      apiClient.post(`/currencies/`, newCurrency),
    {
      onSuccess: () => {
        toast.success(t("Currency created"));
        queryClient.invalidateQueries(["currencies"]);
      },
      onError: () => {
        toast.error(t("Unable to create currency"));
        queryClient.invalidateQueries(["currencies"]);
      },
    },
  );
};

export const useDeleteCurrency = () => {
  const { t } = useTranslation();

  return useMutation((id: number) => apiClient.delete(`/currencies/${id}/`), {
    onSuccess: () => {
      toast.success(t("Currency deleted"));
      queryClient.invalidateQueries(["currencies"]);
    },
    onError: () => {
      toast.error(t("Unable to delete currency"));
      queryClient.invalidateQueries(["currencies"]);
    },
  });
};

export const useUpdateCurrency = () => {
  const { t } = useTranslation();

  return useMutation(
    ({ id, newCurrency }: UpdateMutationProps) =>
      apiClient.put(`/currencies/${id}/`, newCurrency),
    {
      onSuccess: () => {
        toast.success(t("Currency has been updated"));
        queryClient.invalidateQueries(["currencies"]);
      },
      onError: () => {
        toast.error(t("Unable to update currency"));
        queryClient.invalidateQueries(["currencies"]);
      },
    },
  );
};

export const useInitializeCurrencies = () => {
  const { t } = useTranslation();

  return useMutation(
    () => apiClient.post<ICurrency[]>(`/initialize-data/currencies/`),
    {
      onSuccess: () => {
        toast.success(t("Currencies created"));
        queryClient.invalidateQueries(["currencies"]);
      },
      onError: () => {
        toast.error(t("Unable to create currencies"));
        queryClient.invalidateQueries(["currencies"]);
      },
    },
  );
};
