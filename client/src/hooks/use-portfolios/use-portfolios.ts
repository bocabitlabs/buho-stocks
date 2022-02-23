import { useTranslation } from "react-i18next";
import { useMutation, useQuery } from "react-query";
import { toast } from "react-toastify";
import axios from "axios";
import { getAxiosOptionsWithAuth } from "api/api-client";
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
  const { data } = await axios.get<IPortfolio[]>(
    `/api/v1/portfolios/`,
    getAxiosOptionsWithAuth(),
  );
  return data;
};

export const fetchPortfolio = async (portfolioId: number | undefined) => {
  if (!portfolioId) {
    throw new Error("Id is required");
  }
  const { data } = await axios.get<IPortfolio>(
    `/api/v1/portfolios/${portfolioId}/`,
    getAxiosOptionsWithAuth(),
  );
  return data;
};

export const useAddPortfolio = () => {
  const { t } = useTranslation();

  return useMutation(
    (newPortfolio: IPortfolioFormFields) =>
      axios.post(
        `/api/v1/portfolios/`,
        newPortfolio,
        getAxiosOptionsWithAuth(),
      ),
    {
      onSuccess: () => {
        toast.success(t("Portfolio created"));
        queryClient.invalidateQueries(["portfolios"]);
      },
      onError: () => {
        toast.error(t("Unable to create portfolio"));
        queryClient.invalidateQueries(["portfolios"]);
      },
    },
  );
};

export const useDeletePortfolio = () => {
  const { t } = useTranslation();

  return useMutation(
    ({ portfolioId }: DeleteMutationProps) =>
      axios.delete(
        `/api/v1/portfolios/${portfolioId}/`,
        getAxiosOptionsWithAuth(),
      ),
    {
      onSuccess: (data, variables) => {
        toast.error(t("Portfolio deleted"));
        queryClient.invalidateQueries(["portfolios", variables.portfolioId]);
      },
      onError: () => {
        toast.error(t("Unable to delete portfolio"));
        queryClient.invalidateQueries(["portfolios"]);
      },
    },
  );
};

export const useUpdatePortfolio = () => {
  const { t } = useTranslation();

  return useMutation(
    ({ portfolioId, newPortfolio }: UpdateMutationProps) =>
      axios.put(
        `/api/v1/portfolios/${portfolioId}/`,
        newPortfolio,
        getAxiosOptionsWithAuth(),
      ),
    {
      onSuccess: (data, variables) => {
        toast.success(t("Portfolio has been updated"));
        queryClient.invalidateQueries(["portfolios", variables.portfolioId]);
      },
      onError: () => {
        toast.error(t("Unable to update portfolio"));
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
