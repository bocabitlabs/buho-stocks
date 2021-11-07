import { ApiClient } from "api/api-client";
import { IMarketFormFields } from "types/market";

export default class MarketService {
  endpoint = "/api/v1/markets/";

  create = async (market: IMarketFormFields) => {
    const client = new ApiClient();
    const result = await client.makePostRequest(this.endpoint, market, true);
    return result;
  };

  getAll = async () => {
    const client = new ApiClient();
    const result = await client.makeGetRequest(this.endpoint, true);
    return result;
  };

  getById = async (id: number) => {
    const client = new ApiClient();
    const result = await client.makeGetRequest(`${this.endpoint + id}/`, true);
    return result;
  };

  deleteById = async (id: number) => {
    const client = new ApiClient();
    const result = await client.makeDeleteRequest(this.endpoint, id, true);
    return result;
  };

  update = async (id: number, market: IMarketFormFields) => {
    const client = new ApiClient();
    const result = await client.makePutRequest(this.endpoint, id, market, true);
    return result;
  };
}
