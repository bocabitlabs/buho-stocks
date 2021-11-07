import { ApiClient } from "api/api-client";
import { ISectorFormFields } from "types/sector";

export default class SectorService {
  endpoint = "/api/v1/sectors/";

  endpointSuperSector = "/api/v1/sectors/super/";

  create = async (sector: ISectorFormFields, isSuperSector: boolean) => {
    const client = new ApiClient();
    let { endpoint } = this;
    if (isSuperSector) {
      endpoint = this.endpointSuperSector;
    }
    const result = await client.makePostRequest(endpoint, sector, true);
    return result;
  };

  getAll = async (isSuperSector: boolean) => {
    const client = new ApiClient();
    let { endpoint } = this;
    if (isSuperSector) {
      endpoint = this.endpointSuperSector;
    }
    const result = await client.makeGetRequest(endpoint, true);
    return result;
  };

  getById = async (id: number, isSuperSector: boolean) => {
    const client = new ApiClient();
    let { endpoint } = this;
    if (isSuperSector) {
      endpoint = this.endpointSuperSector;
    }
    const result = await client.makeGetRequest(`${endpoint + id}/`, true);
    return result;
  };

  deleteById = async (id: number, isSuperSector: boolean) => {
    const client = new ApiClient();
    let { endpoint } = this;
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
    let { endpoint } = this;
    if (isSuperSector) {
      endpoint = this.endpointSuperSector;
    }
    const result = await client.makePutRequest(endpoint, id, sector, true);
    return result;
  };
}
