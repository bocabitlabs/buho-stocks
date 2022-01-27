import { useMutation, useQuery } from "react-query";
import axios from "axios";
import { getAxiosOptionsWithAuth } from "api/api-client";
import queryClient from "api/query-client";
import { ICompany, ICompanyFormFields } from "types/company";

interface AddMutationProps {
  newCompany: ICompanyFormFields;
  portfolioId: number | undefined;
}

interface UpdateMutationProps {
  newCompany: ICompanyFormFields;
  portfolioId: number | undefined;
  companyId: number | undefined;
}

interface DeleteMutationProps {
  portfolioId: number | undefined;
  companyId: number | undefined;
}

export const fetchCompanies = async (portfolioId: number | undefined) => {
  const { data } = await axios.get<ICompany[]>(
    `/api/v1/portfolios/${portfolioId}/companies/`,
    getAxiosOptionsWithAuth(),
  );
  return data;
};

export const fetchCompany = async (
  portfolioId: number | undefined,
  companyId: number | undefined,
) => {
  if (!companyId || !portfolioId) {
    throw new Error("marketId is required");
  }
  const { data } = await axios.get<ICompany>(
    `/api/v1/portfolios/${portfolioId}/companies/${companyId}/`,
    getAxiosOptionsWithAuth(),
  );
  return data;
};

export const useAddCompany = () => {
  return useMutation(
    ({ portfolioId, newCompany }: AddMutationProps) =>
      axios.post(
        `/api/v1/portfolios/${portfolioId}/companies/`,
        newCompany,
        getAxiosOptionsWithAuth(),
      ),
    {
      onSuccess: (data, variables) => {
        queryClient.invalidateQueries(["companies", variables.portfolioId]);
      },
    },
  );
};

export const useDeleteCompany = () => {
  return useMutation(
    ({ portfolioId, companyId }: DeleteMutationProps) =>
      axios.delete(
        `/api/v1/portfolios/${portfolioId}/companies/${companyId}/`,
        getAxiosOptionsWithAuth(),
      ),
    {
      onSuccess: (data, variables) => {
        queryClient.invalidateQueries([
          "companies",
          variables.portfolioId,
          variables.companyId,
        ]);
      },
    },
  );
};

export const useUpdateCompany = () => {
  return useMutation(
    ({ portfolioId, companyId, newCompany }: UpdateMutationProps) =>
      axios.put(
        `/api/v1/portfolios/${portfolioId}/companies/${companyId}/`,
        newCompany,
        getAxiosOptionsWithAuth(),
      ),
    {
      onSuccess: (data, variables) => {
        queryClient.invalidateQueries([
          "companies",
          variables.portfolioId,
          variables.companyId,
        ]);
      },
    },
  );
};

export function useCompanies(portfolioId: number | undefined) {
  return useQuery<ICompany[], Error>(["companies", portfolioId], () =>
    fetchCompanies(portfolioId),
  );
}

export function useCompany(
  portfolioId: number | undefined,
  companyId: number | undefined,
) {
  return useQuery<ICompany, Error>(
    ["companies", portfolioId, companyId],
    () => fetchCompany(portfolioId, companyId),
    {
      // The query will not execute until the userId exists
      enabled: !!portfolioId && !!companyId,
    },
  );
}
