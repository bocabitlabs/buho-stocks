import { ApiClient } from "api/api-client";

export default class SettingsService {
  static getSettings = async () => {
    const client = new ApiClient();
    const result = await client.makeGetRequest(client.settingsEndpoint, true);
    return result;
  };

  static updateSettings = async (settingsId: number, data: any) => {
    const client = new ApiClient();

    const result = await client.makePutRequest(
      client.settingsEndpoint,
      settingsId,
      data,
      true
    );
    return result;
  };
}
