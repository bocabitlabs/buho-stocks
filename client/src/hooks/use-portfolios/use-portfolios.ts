import { useMutation, useQuery } from "react-query";
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
  return useMutation(
    (newPortfolio: IPortfolioFormFields) =>
      axios.post(
        `/api/v1/portfolios/`,
        newPortfolio,
        getAxiosOptionsWithAuth(),
      ),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["portfolios"]);
      },
    },
  );
};

export const useDeletePortfolio = () => {
  return useMutation(
    ({ portfolioId }: DeleteMutationProps) =>
      axios.delete(
        `/api/v1/portfolios/${portfolioId}/`,
        getAxiosOptionsWithAuth(),
      ),
    {
      onSuccess: (data, variables) => {
        queryClient.invalidateQueries(["portfolios", variables.portfolioId]);
      },
    },
  );
};

export const useUpdatePortfolio = () => {
  return useMutation(
    ({ portfolioId, newPortfolio }: UpdateMutationProps) =>
      axios.put(
        `/api/v1/portfolios/${portfolioId}/`,
        newPortfolio,
        getAxiosOptionsWithAuth(),
      ),
    {
      onSuccess: (data, variables) => {
        queryClient.invalidateQueries(["portfolios", variables.portfolioId]);
      },
    },
  );
};

export function usePortfolios() {
  return useQuery<IPortfolio[], Error>("portfolios", fetchPortfolios);
}

export function usePortfolio(
  portfolioId: number | undefined,
  otherOptions?: any,
) {
  return useQuery<IPortfolio, Error>(
    ["portfolios", portfolioId],
    () => fetchPortfolio(portfolioId),
    {
      // The query will not execute until the userId exists
      enabled: !!portfolioId,
      ...otherOptions,
    },
  );
}
