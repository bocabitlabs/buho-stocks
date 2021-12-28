import { IMarket } from "types/market";

export const serializeMarket = (data: any) => {
  const serializedData: IMarket = {
    id: data.id,
    name: data.name,
    description: data.description,
    color: data.color,
    region: data.region,
    openTime: data.open_time,
    closeTime: data.close_time,
    dateCreated: data.date_created,
    lastUpdated: data.last_updated,
  };
  return serializedData;
};

export default serializeMarket;
