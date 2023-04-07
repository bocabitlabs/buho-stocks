import { useTranslation } from "react-i18next";
import { useMutation, useQuery } from "react-query";
import { toast } from "react-toastify";
import { apiClient } from "api/api-client";
import queryClient from "api/query-client";
import { IPortfolio, IPortfolioFormFields } from "types/portfolio";

interface UpdateMutationProps {
  newPortfolio: IPortfolioFormFields;
  portfolioId: number | undefined;
}

interface DeleteMutationProps {
  portfolioId: number | undefined;
}

export const fetchPortfolios = async () => {
  const { data } = await apiClient.get<IPortfolio[]>(`/portfolios/`);
  return data;
};

export const fetchPortfolio = async (portfolioId: number | undefined) => {
  if (!portfolioId) {
    throw new Error("Id is required");
  }
  const { data } = await apiClient.get<IPortfolio>(
    `/portfolios/${portfolioId}/`,
  );
  return data;
};

export const useAddPortfolio = () => {
  const { t } = useTranslation();

  return useMutation(
    (newPortfolio: IPortfolioFormFields) =>
      apiClient.post(`/portfolios/`, newPortfolio),
    {
      onSuccess: () => {
        toast.success<string>(t("Portfolio created"));
        queryClient.invalidateQueries(["portfolios"]);
      },
      onError: () => {
        toast.error<string>(t("Unable to create portfolio"));
        queryClient.invalidateQueries(["portfolios"]);
      },
    },
  );
};

export const useDeletePortfolio = () => {
  const { t } = useTranslation();

  return useMutation(
    ({ portfolioId }: DeleteMutationProps) =>
      apiClient.delete(`/portfolios/${portfolioId}/`),
    {
      onSuccess: () => {
        toast.success<string>(t("Portfolio deleted"));
        queryClient.invalidateQueries(["portfolios"]);
      },
      onError: () => {
        toast.error<string>(t("Unable to delete portfolio"));
        queryClient.invalidateQueries(["portfolios"]);
      },
    },
  );
};

export const useUpdatePortfolio = () => {
  const { t } = useTranslation();

  return useMutation(
    ({ portfolioId, newPortfolio }: UpdateMutationProps) =>
      apiClient.put(`/portfolios/${portfolioId}/`, newPortfolio),
    {
      onSuccess: () => {
        toast.success<string>(t("Portfolio has been updated"));
        queryClient.invalidateQueries(["portfolios"]);
      },
      onError: () => {
        toast.error<string>(t("Unable to update portfolio"));
        queryClient.invalidateQueries(["portfolios"]);
      },
    },
  );
};

export function usePortfolios() {
  return useQuery<IPortfolio[], Error>("portfolios", fetchPortfolios);
}

export function usePortfolio(portfolioId: number | undefined, options?: any) {
  return useQuery<IPortfolio, Error>(
    ["portfolios", portfolioId],
    () => fetchPortfolio(portfolioId),
    {
      // The query will not execute until the userId exists
      enabled: !!portfolioId,
      ...options,
    },
  );
}
