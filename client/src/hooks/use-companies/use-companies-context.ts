import { useCallback, useState } from "react";
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router";
import { message } from "antd";
import { CompaniesContextType } from "contexts/companies";
import { useApi } from "hooks/use-api/use-api-hook";
import getRoute, { PORTFOLIOS_ROUTE } from "routes";
import { ICompany, ICompanyFormFields } from "types/company";

export function useCompaniesContext(portfolioId: string): CompaniesContextType {
  const [company, setCompany] = useState<ICompany | null>(null);
  const [companies, setCompanies] = useState<ICompany[] | []>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { t } = useTranslation();
  const history = useHistory();
  const {
    get: apiGet,
    post: apiPost,
    put: apiPut,
    delete: apiDelete
  } = useApi();
  const endpoint = `/api/v1/portfolios/${portfolioId}/companies/`;

  const getAll = useCallback(async () => {
    setIsLoading(true);
    const response = await apiGet(endpoint);
    if (response.error) {
      console.error(response);
    }
    setCompanies(response);
    setIsLoading(false);
  }, [apiGet, endpoint]);

  const getById = useCallback(
    async (id: number) => {
      console.log(`Get company id:${id}`);
      setIsLoading(true);
      const response = await apiGet(endpoint + id);
      if (response?.error) {
        console.error(response);
      }
      setCompany(response);
      setIsLoading(false);
    },
    [apiGet, endpoint]
  );

  const create = async (newValues: ICompanyFormFields) => {
    const response = await apiPost(endpoint, newValues);
    if (response?.error) {
      message.error({
        content: t(`Error ${response.statusCode}: Unable to create company`)
      });
    } else {
      setCompany(response);
      message.success({ content: t("Company has been created") });
      history.push(getRoute(PORTFOLIOS_ROUTE));
    }
    return response;
  };

  const deleteById = async (id: number) => {
    const response = await apiDelete(endpoint + id);
    if (response?.error) {
      message.error({
        content: t(`Error ${response.statusCode}: Unable to delete company`)
      });
    } else {
      setCompany(null);
      getAll();
      message.success({ content: t("Company has been deleted") });
    }
    return response;
  };

  const update = async (id: number, newValues: ICompanyFormFields) => {
    const response = await apiPut(`${endpoint + id}/`, newValues);
    if (response?.error) {
      message.error({
        content: t(`Error ${response.statusCode}: Unable to update company`)
      });
    } else {
      getById(id);
      message.success({ content: t("Company has been updated") });
    }
    return response;
  };

  return {
    isLoading,
    company,
    companies,
    create,
    deleteById,
    getAll,
    getById,
    update
  };
}

export default useCompaniesContext;
