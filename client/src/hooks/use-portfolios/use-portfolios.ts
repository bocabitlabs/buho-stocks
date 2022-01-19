import { useMutation, useQuery, useQueryClient } from "react-query";
import axios from "axios";
import { getAxiosOptionsWithAuth } from "api/api-client";
import { IPortfolioFormFields } from "types/portfolio";

// interface AddMutationProps {
//   newPortfolio: IPortfolioFormFields;
// }

interface UpdateMutationProps {
  newPortfolio: IPortfolioFormFields;
  portfolioId: number | undefined;
}

interface DeleteMutationProps {
  portfolioId: number | undefined;
}

export const fetchPortfolios = async () => {
  const { data } = await axios.get(
    `/api/v1/portfolios/`,
    getAxiosOptionsWithAuth(),
  );
  return data;
};

export const fetchPortfolio = async (portfolioId: number | undefined) => {
  if (!portfolioId) {
    throw new Error("Id is required");
  }
  const { data } = await axios.get(
    `/api/v1/portfolios/${portfolioId}/`,
    getAxiosOptionsWithAuth(),
  );
  return data;
};

export const useAddPortfolio = () => {
  const queryClient = useQueryClient();

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
  const queryClient = useQueryClient();

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
  const queryClient = useQueryClient();

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
  return useQuery("portfolios", fetchPortfolios);
}

export function usePortfolio(
  portfolioId: number | undefined,
  otherOptions?: any,
) {
  return useQuery(
    ["portfolios", portfolioId],
    () => fetchPortfolio(portfolioId),
    {
      // The query will not execute until the userId exists
      enabled: !!portfolioId,
      ...otherOptions,
    },
  );
}
