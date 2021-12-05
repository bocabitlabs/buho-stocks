import { useCallback, useState } from "react";
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router";
import { message } from "antd";
import { SectorsContextType } from "contexts/secctors";
import { useApi } from "hooks/use-api/use-api-hook";
import getRoute, { SECTORS_ROUTE } from "routes";
import { ISector, ISectorFormFields } from "types/sector";

export function useSectorsContext(): SectorsContextType {
  const [sector, setSector] = useState<ISector | null>(null);
  const [superSector, setSuperSector] = useState<ISector | null>(null);
  const [sectors, setSectors] = useState<ISector[] | []>([]);
  const [superSectors, setSuperSectors] = useState<ISector[] | []>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { t } = useTranslation();
  const history = useHistory();
  const {
    get: apiGet,
    post: apiPost,
    put: apiPut,
    delete: apiDelete
  } = useApi();
  const endpoint = "/api/v1/sectors/";
  const endpointSuperSector = "/api/v1/sectors/super/";

  const getAll = useCallback(async () => {
    setIsLoading(true);
    const response = await apiGet(endpoint);
    if (response.error) {
      console.error(response);
    }
    setSectors(response);
    setIsLoading(false);
  }, [apiGet]);

  const getAllSuperSectors = useCallback(async () => {
    setIsLoading(true);
    const response = await apiGet(endpointSuperSector);
    if (response.error) {
      console.error(response);
    }
    setSuperSectors(response);
    setIsLoading(false);
  }, [apiGet]);

  const getById = useCallback(
    async (id: number) => {
      setIsLoading(true);
      const response = await apiGet(endpoint + id);
      if (response?.error) {
        console.error(response);
      }
      setSector(response);
      setIsLoading(false);
    },
    [apiGet]
  );

  const getSuperSectorById = useCallback(
    async (id: number) => {
      setIsLoading(true);
      const response = await apiGet(endpointSuperSector + id);
      if (response?.error) {
        console.error(response);
      }
      setSuperSector(response.result);
      setIsLoading(false);
    },
    [apiGet]
  );

  const create = async (newValues: ISectorFormFields) => {
    const response = await apiPost(endpoint, newValues);
    if (response?.error) {
      message.error({
        content: t(`Error ${response.statusCode}: Unable to create sector`)
      });
    } else {
      setSector(response.result);
      message.success({ content: t("Sector has been created") });
      history.push(getRoute(SECTORS_ROUTE));
    }
    return response;
  };

  const createSuperSector = async (newValues: ISectorFormFields) => {
    const response = await apiPost(endpointSuperSector, newValues);
    if (response?.error) {
      message.error({
        content: t(
          `Error ${response.statusCode}: Unable to create super sector`
        )
      });
    } else {
      setSector(response.result);
      message.success({ content: t("Super sector has been created") });
      history.push(getRoute(SECTORS_ROUTE));
    }
    return response;
  };

  const deleteById = async (id: number) => {
    const response = await apiDelete(endpoint + id);
    if (response?.error) {
      message.error({
        content: t(`Error ${response.statusCode}: Unable to delete sector`)
      });
    } else {
      setSector(null);
      getAll();
      message.success({ content: t("Sector has been deleted") });
    }
    return response;
  };

  const deleteSuperSectorById = async (id: number) => {
    const response = await apiDelete(endpointSuperSector + id);
    if (response?.error) {
      message.error({
        content: t(
          `Error ${response.statusCode}: Unable to delete super sector`
        )
      });
    } else {
      setSector(null);
      getAll();
      message.success({ content: t("Super Sector has been deleted") });
    }
    return response;
  };

  const update = async (id: number, newValues: ISectorFormFields) => {
    const response = await apiPut(`${endpoint + id}/`, newValues);
    if (response?.error) {
      message.error({
        content: t(`Error ${response.statusCode}: Unable to update sector`)
      });
    } else {
      getById(id);
      message.success({ content: t("Sector has been updated") });
    }
    return response;
  };

  const updateSuperSector = async (
    id: number,
    newValues: ISectorFormFields
  ) => {
    const response = await apiPut(`${endpointSuperSector + id}/`, newValues);
    if (response?.error) {
      message.error({
        content: t(`Error ${response.statusCode}: Unable to update sector`)
      });
    } else {
      getById(id);
      message.success({ content: t("Sector has been updated") });
    }
    return response;
  };

  return {
    isLoading,
    sector,
    sectors,
    superSector,
    superSectors,
    create,
    createSuperSector,
    deleteById,
    deleteSuperSectorById,
    getAll,
    getAllSuperSectors,
    getById,
    getSuperSectorById,
    update,
    updateSuperSector
  };
}

export default useSectorsContext;
