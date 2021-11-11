import { ILoginData, IRegistrationData, ApiClient } from "api/api-client";

export default class AuthService {
  loginUserEndpoint = "/auth/api-token-auth/";

  registerUserEndpoint = "/auth/register/";

  registerUser = async (registrationData: IRegistrationData): Promise<any> => {
    try {
      const client = new ApiClient();
      const result = await client.makePostRequest(
        this.registerUserEndpoint,
        registrationData,
        true
      );
      return result;
    } catch (error) {
      return { error: true, result: error, statusCode: 0 };
    }
  };

  loginUser = async (loginData: ILoginData): Promise<any> => {
    try {
      const client = new ApiClient();
      const result = await client.makePostRequest(
        this.loginUserEndpoint,
        loginData,
        true
      );
      return result;
    } catch (error) {
      return { error: true, result: error, statusCode: 0 };
    }
  };
}
