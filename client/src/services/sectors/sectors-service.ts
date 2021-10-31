import ApiClient from "api/api-client";
import { ISectorFormFields } from "types/sector";

export default class SectorService {
  endpoint = "/api/v1/sectors/";
  endpointSuperSector = "/api/v1/sectors/super/";

  create = async (sector: ISectorFormFields, isSuperSector: boolean) => {
    const client = new ApiClient();
    let endpoint = this.endpoint;
    if (isSuperSector) {
      endpoint = this.endpointSuperSector;
    }
    return await client.makePostRequest(endpoint, sector, true);
  };

  getAll = async (isSuperSector: boolean) => {
    const client = new ApiClient();
    let endpoint = this.endpoint;
    if (isSuperSector) {
      endpoint = this.endpointSuperSector;
    }
    const result = await client.makeGetRequest(endpoint, true);
    return result;
  };

  getById = async (id: number, isSuperSector: boolean) => {
    const client = new ApiClient();
    let endpoint = this.endpoint;
    if (isSuperSector) {
      endpoint = this.endpointSuperSector;
    }
    const result = await client.makeGetRequest(endpoint + id + "/", true);
    return result;
  };

  deleteById = async (id: number, isSuperSector: boolean) => {
    const client = new ApiClient();
    let endpoint = this.endpoint;
    if (isSuperSector) {
      endpoint = this.endpointSuperSector;
    }
    const result = await client.makeDeleteRequest(endpoint, id, true);
    return result;
  };

  update = async (
    id: number,
    sector: ISectorFormFields,
    isSuperSector: boolean
  ) => {
    const client = new ApiClient();
    let endpoint = this.endpoint;
    if (isSuperSector) {
      endpoint = this.endpointSuperSector;
    }
    const result = await client.makePutRequest(endpoint, id, sector, true);
    return result;
  };
}
