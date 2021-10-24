import ApiClient from "api/api-client";
import { IMarketFormFields } from "types/market";

export default class MarketService {
  static create = async (market: IMarketFormFields) => {
    const client = new ApiClient();
    return await client.makePostRequest(client.marketsEndpoint, market, true);
  };

  static getAll = async () => {
    const client = new ApiClient();
    const result = await client.makeGetRequest(client.marketsEndpoint, true);
    return result;
  };

  static getById = async (id: number) => {
    const client = new ApiClient();
    const result = await client.makeGetRequest(
      client.marketsEndpoint + id + "/",
      true
    );
    return result;
  };

  static deleteById = async (id: number) => {
    const client = new ApiClient();
    const result = await client.makeDeleteRequest(
      client.marketsEndpoint,
      id,
      true
    );
    return result;
  };

  static update = async (id: number, market: IMarketFormFields) => {
    const client = new ApiClient();
    const result = await client.makePutRequest(
      client.marketsEndpoint,
      id,
      market,
      true
    );
    return result;
  };
}
