import React, { FC, ReactNode, useContext, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Spin } from "antd";
import { SectorsContext } from "contexts/secctors";

export interface IParams {
  id: string;
}

const SectorLoader: FC<ReactNode> = ({ children }) => {
  const {
    isLoading,
    sector,
    getById: getSector,
    getAllSuperSectors
  } = useContext(SectorsContext);
  const params = useParams<IParams>();
  const { id } = params;
  console.log("ID: ", id);

  useEffect(() => {
    const getAll = async () => {
      getAllSuperSectors();
    };
    if (id) {
      getSector(+id);
    }
    getAll();
  }, [getSector, getAllSuperSectors, id]);

  if (isLoading || !sector) {
    return <Spin />;
  }

  return <>{children}</>;
};

export default SectorLoader;
