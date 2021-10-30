import { ApiClient } from "api/api-client";

export default class SettingsService {
  endpoint = "/api/v1/settings/";

  getSettings = async () => {
    const client = new ApiClient();
    const result = await client.makeGetRequest(this.endpoint, true);
    return result;
  };

  updateSettings = async (settingsId: number, data: any) => {
    const client = new ApiClient();

    const result = await client.makePutRequest(
      this.endpoint,
      settingsId,
      data,
      true
    );
    return result;
  };
}
