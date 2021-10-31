import { message } from "antd";
import { SectorsContextType } from "contexts/secctors";
import { useCallback, useState } from "react";
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router";
import getRoute, { MARKETS_ROUTE } from "routes";
import SectorService from "services/sectors/sectors-service";
import { ISector, ISectorFormFields } from "types/sector";

export function useSectorsContext(): SectorsContextType {
  const [sector, setSector] = useState<ISector | null>(null);
  const [superSector, setSuperSector] = useState<ISector | null>(null);
  const [sectors, setSectors] = useState<ISector[] | []>([]);
  const [superSectors, setSuperSectors] = useState<ISector[] | []>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { t } = useTranslation();
  const history = useHistory();

  const getAll = useCallback(async () => {
    setIsLoading(true);
    const isSuperSector = false;
    const response = await new SectorService().getAll(isSuperSector);
    if (response.error) {
      console.error(response);
    }
    setSectors(response.result);
    setIsLoading(false);
  }, []);

  const getAllSuperSectors = useCallback(async () => {
    setIsLoading(true);
    const isSuperSector = true;
    const response = await new SectorService().getAll(isSuperSector);
    if (response.error) {
      console.error(response);
    }
    setSuperSectors(response.result);
    setIsLoading(false);
  }, []);

  const getById = useCallback(async (id: number) => {
    setIsLoading(true);
    const isSuperSector = false;
    const response = await new SectorService().getById(id, isSuperSector);
    if (response?.error) {
      console.error(response);
    }
    setSector(response.result);
    setIsLoading(false);
  }, []);

  const getSuperSectorById = useCallback(async (id: number) => {
    setIsLoading(true);
    const isSuperSector = true;
    const response = await new SectorService().getById(id, isSuperSector);
    if (response?.error) {
      console.error(response);
    }
    setSuperSector(response.result);
    setIsLoading(false);
  }, []);

  const create = async (newValues: ISectorFormFields) => {
    const isSuperSector = false;
    const response = await new SectorService().create(newValues, isSuperSector);
    if (response?.error) {
      message.error({
        content: t(`Error ${response.statusCode}: Unable to create sector`)
      });
    } else {
      setSector(response.result);
      message.success({ content: t("Sector has been created") });
    }
    history.push(getRoute(MARKETS_ROUTE));
    return response;
  };

  const createSuperSector = async (newValues: ISectorFormFields) => {
    const isSuperSector = true;
    const response = await new SectorService().create(newValues, isSuperSector);
    if (response?.error) {
      message.error({
        content: t(`Error ${response.statusCode}: Unable to create super sector`)
      });
    } else {
      setSector(response.result);
      message.success({ content: t("Super sector has been created") });
    }
    history.push(getRoute(MARKETS_ROUTE));
    return response;
  };

  const deleteById = async (id: number) => {
    const isSuperSector = false;
    const response = await new SectorService().deleteById(id, isSuperSector);
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
    const isSuperSector = true;
    const response = await new SectorService().deleteById(id, isSuperSector);
    if (response?.error) {
      message.error({
        content: t(`Error ${response.statusCode}: Unable to delete super sector`)
      });
    } else {
      setSector(null);
      getAll();
      message.success({ content: t("Super Sector has been deleted") });
    }
    return response;
  };

  const update = async (id: number, newValues: ISectorFormFields) => {
    const isSuperSector = true;
    const response = await new SectorService().update(id, newValues, isSuperSector);
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

  const updateSuperSector = async (id: number, newValues: ISectorFormFields) => {
    const isSuperSector = true;
    const response = await new SectorService().update(id, newValues, isSuperSector);
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
