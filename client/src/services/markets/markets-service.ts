import ApiClient from "api/api-client";
import { IMarketFormFields } from "types/market";

export default class MarketService {
  static create = async (market: IMarketFormFields) => {
    const data = {
      name: market.name,
      description: market.description,
      color: market.color,
      region: market.region,
      open_time: market.openTime,
      close_time: market.closeTime
    };
    const client = new ApiClient();
    return await client.makePostRequest(client.marketsEndpoint, data, true);
  };

  static getAll = async () => {
    const client = new ApiClient();
    const result = await client.makeGetRequest(client.marketsEndpoint, true);
    return result;
  };

  static deleteById = async (id: number) => {
    const client = new ApiClient();
    const result = await client.makeDeleteRequest(client.marketsEndpoint, id, true);
    return result;
  };

  static update = async (id: number, market: IMarketFormFields) => {
    const data = {
      name: market.name,
      description: market.description,
      color: market.color,
      region: market.region,
      open_time: market.openTime,
      close_time: market.closeTime
    };
    const client = new ApiClient();
    const result = await client.makePutRequest(client.marketsEndpoint, id, data, true);
    return result;
   };
}
