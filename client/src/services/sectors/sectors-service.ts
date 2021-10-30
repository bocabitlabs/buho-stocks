import ApiClient from "api/api-client";
import { ISectorFormFields } from "types/sector";

export default class SectorService {
  endpoint = "/api/v1/sectors/";

  create = async (sector: ISectorFormFields) => {
    const client = new ApiClient();
    return await client.makePostRequest(this.endpoint, sector, true);
  };

  getAll = async () => {
    const client = new ApiClient();
    const result = await client.makeGetRequest(this.endpoint, true);
    return result;
  };

  getById = async (id: number) => {
    const client = new ApiClient();
    const result = await client.makeGetRequest(
      this.endpoint + id + "/",
      true
    );
    return result;
  };

  deleteById = async (id: number) => {
    const client = new ApiClient();
    const result = await client.makeDeleteRequest(
      this.endpoint,
      id,
      true
    );
    return result;
  };

  update = async (id: number, sector: ISectorFormFields) => {
    const client = new ApiClient();
    const result = await client.makePutRequest(
      this.endpoint,
      id,
      sector,
      true
    );
    return result;
  };
}
