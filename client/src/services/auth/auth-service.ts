import ApiClient, { IApiResponse, ILoginData, IRegistrationData } from "api/api-client";

export default class AuthService {
  static registerUser = async (
    registrationData: IRegistrationData
  ): Promise<IApiResponse> => {
    try {
      const client = new ApiClient();
      const result = await client.makePostRequest(
        client.registerUserEndpoint,
        registrationData,
        true
      );
      return result;
    } catch (error) {
      console.error(error);
      return { error: true, result: error, statusCode: 0 };
    }
  };
  static loginUser = async (loginData: ILoginData): Promise<IApiResponse> => {
    try {
      const client = new ApiClient();
      const result = await client.makePostRequest(
        client.loginUserEndpoint,
        loginData,
        true
      );
      return result;
    } catch (error) {
      console.error(error);
      return { error: true, result: error, statusCode: 0 };
    }
  };
}