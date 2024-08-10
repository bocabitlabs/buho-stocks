import { useQuery } from "@tanstack/react-query";
import { apiClient } from "api/api-client";
import { ICompanySearchResult } from "types/company";

export const fetchCompanySearch = async (ticker: string | undefined) => {
  const fetchURL = new URL(
    `companies/search/${ticker}/`,
    apiClient.defaults.baseURL,
  );

  const { data } = await apiClient.get<ICompanySearchResult>(fetchURL.href);
  return data;
};

export function useCompanySearch(ticker: string | undefined) {
  return useQuery<ICompanySearchResult, Error>({
    enabled: !!ticker,
    queryKey: ["companySearch", ticker],
    queryFn: () => fetchCompanySearch(ticker),
  });
}
