import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useMutation, useQuery } from "@tanstack/react-query";
import { MRT_PaginationState, MRT_SortingState } from "mantine-react-table";
import { apiClient } from "api/api-client";
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

type CompaniesApiResponse = {
  results: Array<ICompany>;
  count: number;
  next: number | null;
  previous: number | null;
};

export const fetchCompanies = async (
  portfolioId: number | undefined,
  closed: boolean,
  pagination: MRT_PaginationState | undefined = undefined,
  sorting: MRT_SortingState | undefined = undefined,
) => {
  const fetchURL = new URL(
    `/api/v1/portfolios/${portfolioId}/companies/`,
    apiClient.defaults.baseURL,
  );
  fetchURL.searchParams.set("closed", `${closed}`);

  if (pagination) {
    fetchURL.searchParams.set(
      "offset",
      `${pagination.pageIndex * pagination.pageSize}`,
    );
    fetchURL.searchParams.set("limit", `${pagination.pageSize}`);
  }

  if (sorting?.length === 0) {
    fetchURL.searchParams.set("sort_by", "ticker");
    fetchURL.searchParams.set("order_by", "asc");
  } else {
    const newSortBy = sorting?.[0].id ?? "ticker";
    fetchURL.searchParams.set("sort_by", newSortBy);
    const newOrderBy = sorting?.[0].desc ? "desc" : "asc";
    fetchURL.searchParams.set("order_by", newOrderBy);
  }

  const { data } = await apiClient.get<CompaniesApiResponse>(fetchURL.href);
  return data;
};

export function useCompanies(
  portfolioId: number | undefined,
  sorting?: MRT_SortingState,
  pagination?: MRT_PaginationState,
  closed: boolean = false,
) {
  return useQuery<CompaniesApiResponse, Error>({
    queryKey: ["portfolios", portfolioId, closed, pagination, sorting],
    queryFn: () => fetchCompanies(portfolioId, closed, pagination, sorting),
  });
}

export const fetchCompaniesAll = async (
  portfolioId: number | undefined,
  closed: boolean,
) => {
  const fetchURL = new URL(
    `/api/v1/portfolios/${portfolioId}/companies/`,
    apiClient.defaults.baseURL,
  );
  fetchURL.searchParams.set("closed", `${closed}`);

  const { data } = await apiClient.get<ICompany[]>(fetchURL.href);
  return data;
};

export function useCompaniesAll(
  portfolioId: number | undefined,
  sorting?: MRT_SortingState,
  pagination?: MRT_PaginationState,
  closed: boolean = false,
  options?: any,
) {
  return useQuery<ICompany[], Error>({
    queryKey: ["portfolios", portfolioId, closed],
    queryFn: () => fetchCompaniesAll(portfolioId, closed),
    ...options,
  });
}

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

interface MutateProps {
  onSuccess?: Function;
  onError?: Function;
}

export const useAddCompany = (props?: MutateProps) => {
  const { t } = useTranslation();
  return useMutation({
    mutationFn: ({ portfolioId, newCompany }: AddMutationProps) =>
      apiClient.post(`/portfolios/${portfolioId}/companies/`, newCompany),
    onSuccess: (data, variables) => {
      props?.onSuccess?.();
      toast.success(`${t("Company has been created")}`);
      queryClient.invalidateQueries({
        queryKey: ["portfolios", variables.portfolioId],
      });
    },
    onError: () => {
      props?.onError?.();
      toast.error(t("Unable to create company"));
    },
  });
};

export const useDeleteCompany = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: ({ portfolioId, companyId }: DeleteMutationProps) =>
      apiClient.delete(`/portfolios/${portfolioId}/companies/${companyId}/`),
    onSuccess: (data, variables) => {
      toast.success(`${t("Company has been deleted")}`);
      navigate(-1);
      queryClient.invalidateQueries({
        queryKey: ["portfolios", variables.portfolioId],
      });
    },
    onError: () => {
      toast.error(t("Unable to delete company"));
    },
  });
};

export const useUpdateCompany = (props?: MutateProps) => {
  const { t } = useTranslation();
  return useMutation({
    mutationFn: ({ portfolioId, companyId, newCompany }: UpdateMutationProps) =>
      apiClient.patch(
        `/portfolios/${portfolioId}/companies/${companyId}/`,
        newCompany,
      ),
    onSuccess: (data, variables) => {
      props?.onSuccess?.();
      toast.success(t("Company has been updated"));
      queryClient.invalidateQueries({
        queryKey: ["portfolios", variables.portfolioId],
      });
    },
    onError: () => {
      props?.onError?.();
      toast.error(t("Unable to update company"));
    },
  });
};

export function useCompany(
  portfolioId: number | undefined,
  companyId: number | undefined,
  options?: any,
) {
  return useQuery<ICompany, Error>({
    queryKey: ["portfolios", portfolioId, companyId],
    queryFn: () => fetchCompany(portfolioId, companyId),
    enabled: !!portfolioId && !!companyId,
    ...options,
  });
}
