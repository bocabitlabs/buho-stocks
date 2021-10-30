import ApiClient, { IApiResponse, ILoginData, IRegistrationData } from "api/api-client";

export default class AuthService {
  loginUserEndpoint = "/auth/api-token-auth/";
  registerUserEndpoint = "/auth/register/";

  registerUser = async (
    registrationData: IRegistrationData
  ): Promise<IApiResponse> => {
    try {
      const client = new ApiClient();
      const result = await client.makePostRequest(
        this.registerUserEndpoint,
        registrationData,
        true
      );
      return result;
    } catch (error) {
      console.error(error);
      return { error: true, result: error, statusCode: 0 };
    }
  };
  loginUser = async (loginData: ILoginData): Promise<IApiResponse> => {
    try {
      const client = new ApiClient();
      const result = await client.makePostRequest(
        this.loginUserEndpoint,
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