import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import { useMutation, useQuery } from "@tanstack/react-query";
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

  return useMutation({
    mutationFn: (newPortfolio: IPortfolioFormFields) =>
      apiClient.post(`/portfolios/`, newPortfolio),
    onSuccess: () => {
      toast.success<string>(t("Portfolio created"));
      queryClient.invalidateQueries({ queryKey: ["portfolios"] });
    },
    onError: () => {
      toast.error<string>(t("Unable to create portfolio"));
    },
  });
};

export const useDeletePortfolio = () => {
  const { t } = useTranslation();

  return useMutation({
    mutationFn: ({ portfolioId }: DeleteMutationProps) =>
      apiClient.delete(`/portfolios/${portfolioId}/`),
    onSuccess: () => {
      toast.success<string>(t("Portfolio deleted"));
      queryClient.invalidateQueries({ queryKey: ["portfolios"] });
    },
    onError: () => {
      toast.error<string>(t("Unable to delete portfolio"));
    },
  });
};

export const useUpdatePortfolio = () => {
  const { t } = useTranslation();

  return useMutation({
    mutationFn: ({ portfolioId, newPortfolio }: UpdateMutationProps) =>
      apiClient.put(`/portfolios/${portfolioId}/`, newPortfolio),
    onSuccess: () => {
      toast.success<string>(t("Portfolio has been updated"));
      queryClient.invalidateQueries({ queryKey: ["portfolios"] });
    },
    onError: () => {
      toast.error<string>(t("Unable to update portfolio"));
    },
  });
};

export function usePortfolios() {
  return useQuery<IPortfolio[], Error>({
    queryKey: ["portfolios"],
    queryFn: fetchPortfolios,
  });
}

export function usePortfolio(portfolioId: number | undefined, options?: any) {
  return useQuery<IPortfolio, Error>({
    queryKey: ["portfolios", portfolioId],
    queryFn: () => fetchPortfolio(portfolioId),
    enabled: !!portfolioId,
    ...options,
  });
}
