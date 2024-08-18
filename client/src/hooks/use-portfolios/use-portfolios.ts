import { useTranslation } from "react-i18next";
import { notifications } from "@mantine/notifications";
import { QueryOptions, useMutation, useQuery } from "@tanstack/react-query";
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

interface MutateProps {
  onSuccess?: () => void;
  onError?: () => void;
}

export const useAddPortfolio = (props?: MutateProps) => {
  const { t } = useTranslation();

  return useMutation({
    mutationFn: (newPortfolio: IPortfolioFormFields) =>
      apiClient.post(`/portfolios/`, newPortfolio),
    onSuccess: () => {
      props?.onSuccess?.();
      notifications.show({
        color: "green",
        message: t("Portfolio created"),
      });
      queryClient.invalidateQueries({ queryKey: ["portfolios"] });
    },
    onError: () => {
      props?.onError?.();

      notifications.show({
        color: "red",
        message: t("Unable to create portfolio"),
      });
    },
  });
};

export const useDeletePortfolio = () => {
  const { t } = useTranslation();

  return useMutation({
    mutationFn: ({ portfolioId }: DeleteMutationProps) =>
      apiClient.delete(`/portfolios/${portfolioId}/`),
    onSuccess: () => {
      notifications.show({
        color: "green",
        message: t("Portfolio deleted"),
      });
      queryClient.invalidateQueries({ queryKey: ["portfolios"] });
    },
    onError: () => {
      notifications.show({
        color: "red",
        message: t("Unable to delete portfolio"),
      });
    },
  });
};

export const useUpdatePortfolio = (props?: MutateProps) => {
  const { t } = useTranslation();

  return useMutation({
    mutationFn: ({ portfolioId, newPortfolio }: UpdateMutationProps) =>
      apiClient.put(`/portfolios/${portfolioId}/`, newPortfolio),
    onSuccess: () => {
      props?.onSuccess?.();

      notifications.show({
        color: "green",
        message: t("Portfolio has been updated"),
      });
      queryClient.invalidateQueries({ queryKey: ["portfolios"] });
    },
    onError: () => {
      props?.onError?.();

      notifications.show({
        color: "red",
        message: t("Unable to update portfolio"),
      });
    },
  });
};

export function usePortfolios() {
  return useQuery<IPortfolio[], Error>({
    queryKey: ["portfolios"],
    queryFn: fetchPortfolios,
  });
}

export function usePortfolio(
  portfolioId: number | undefined,
  options?: QueryOptions<IPortfolio, Error>,
) {
  return useQuery<IPortfolio, Error>({
    queryKey: ["portfolios", portfolioId],
    queryFn: () => fetchPortfolio(portfolioId),
    enabled: !!portfolioId,
    ...options,
  });
}
