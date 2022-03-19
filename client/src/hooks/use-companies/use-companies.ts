import { useTranslation } from "react-i18next";
import { useMutation, useQuery } from "react-query";
import { toast } from "react-toastify";
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
        queryClient.invalidateQueries(["portfolios", variables.portfolioId]);
      },
    },
  );
};

export const useDeleteCompany = () => {
  const { t } = useTranslation();
  return useMutation(
    ({ portfolioId, companyId }: DeleteMutationProps) =>
      axios.delete(
        `/api/v1/portfolios/${portfolioId}/companies/${companyId}/`,
        getAxiosOptionsWithAuth(),
      ),
    {
      onSuccess: (data, variables) => {
        toast.success(`${t("Company has been deleted")}`);
        queryClient.invalidateQueries(["portfolios", variables.portfolioId]);
      },
      onError: () => {
        toast.error(t("Unable to create company"));
      },
    },
  );
};

export const useUpdateCompany = () => {
  const { t } = useTranslation();
  return useMutation(
    ({ portfolioId, companyId, newCompany }: UpdateMutationProps) =>
      axios.put(
        `/api/v1/portfolios/${portfolioId}/companies/${companyId}/`,
        newCompany,
        getAxiosOptionsWithAuth(),
      ),
    {
      onSuccess: (data, variables) => {
        toast.success(t("Company has been updated"));
        queryClient.invalidateQueries(["portfolios", variables.portfolioId]);
      },
      onError: () => {
        toast.error(t("Unable to update company"));
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
  options?: any,
) {
  return useQuery<ICompany, Error>(
    ["companies", portfolioId, companyId],
    () => fetchCompany(portfolioId, companyId),
    {
      // The query will not execute until the userId exists
      enabled: !!portfolioId && !!companyId,
      ...options,
    },
  );
}
