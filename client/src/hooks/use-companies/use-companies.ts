import { useTranslation } from "react-i18next";
import { useMutation, useQuery } from "react-query";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { apiClient } from "api/api-client";
import queryClient from "api/query-client";
import { ICompany, ICompanyFormFields, ICompanyListItem } from "types/company";

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

export const fetchCompanies = async (
  portfolioId: number | undefined,
  closed: boolean,
) => {
  const { data } = await apiClient.get<ICompanyListItem[]>(
    `/portfolios/${portfolioId}/companies/?closed=${closed}`,
  );
  return data;
};

export const fetchCompany = async (
  portfolioId: number | undefined,
  companyId: number | undefined,
) => {
  if (!companyId || !portfolioId) {
    throw new Error("companyId and portfolioId are required");
  }
  const { data } = await apiClient.get<ICompany>(
    `/portfolios/${portfolioId}/companies/${companyId}/`,
  );
  return data;
};

export const useAddCompany = () => {
  const { t } = useTranslation();
  return useMutation(
    ({ portfolioId, newCompany }: AddMutationProps) =>
      apiClient.post(`/portfolios/${portfolioId}/companies/`, newCompany),
    {
      onSuccess: (data, variables) => {
        toast.success(`${t("Company has been created")}`);
        queryClient.invalidateQueries(["portfolios", variables.portfolioId]);
      },
      onError: () => {
        toast.error(t("Unable to create company"));
      },
    },
  );
};

export const useDeleteCompany = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  return useMutation(
    ({ portfolioId, companyId }: DeleteMutationProps) =>
      apiClient.delete(`/portfolios/${portfolioId}/companies/${companyId}/`),
    {
      onSuccess: (data, variables) => {
        toast.success(`${t("Company has been deleted")}`);
        navigate(-1);
        queryClient.invalidateQueries(["portfolios", variables.portfolioId]);
      },
      onError: () => {
        toast.error(t("Unable to delete company"));
      },
    },
  );
};

export const useUpdateCompany = () => {
  const { t } = useTranslation();
  return useMutation(
    ({ portfolioId, companyId, newCompany }: UpdateMutationProps) =>
      apiClient.patch(
        `/portfolios/${portfolioId}/companies/${companyId}/`,
        newCompany,
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

export function useCompanies(
  portfolioId: number | undefined,
  closed: boolean = false,
) {
  return useQuery<ICompanyListItem[], Error>(
    ["portfolios", portfolioId, closed],
    () => fetchCompanies(portfolioId, closed),
  );
}

export function useCompany(
  portfolioId: number | undefined,
  companyId: number | undefined,
  options?: any,
) {
  return useQuery<ICompany, Error>(
    ["portfolios", portfolioId, companyId],
    () => fetchCompany(portfolioId, companyId),
    {
      // The query will not execute until the userId exists
      enabled: !!portfolioId && !!companyId,
      ...options,
    },
  );
}
