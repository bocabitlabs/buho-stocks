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
  const [sectors, setSectors] = useState<ISector[] | []>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { t } = useTranslation();
  const history = useHistory();

  const getAll = useCallback(async () => {
    setIsLoading(true);
    const response = await new SectorService().getAll();
    if (response.error) {
      console.error(response);
    }
    setSectors(response.result);
    setIsLoading(false);
  }, []);

  const getById = useCallback(async (id: number) => {
    setIsLoading(true);
    const response = await new SectorService().getById(id);
    if (response?.error) {
      console.error(response);
    }
    setSector(response.result);
    setIsLoading(false);
  }, []);

  const create = async (newValues: ISectorFormFields) => {
    console.log("CREATE");
    const response = await new SectorService().create(newValues);
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

  const deleteById = async (id: number) => {
    const response = await new SectorService().deleteById(id);
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

  const update = async (id: number, newValues: ISectorFormFields) => {
    const response = await new SectorService().update(id, newValues);
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
    create,
    deleteById,
    getAll,
    getById,
    update
  };
}
