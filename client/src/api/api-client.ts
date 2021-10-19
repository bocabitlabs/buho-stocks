export interface HttpRequestHeader {
  [key: string]: string;
}

export interface IRegistrationData {
  username: string;
  password: string;
  password2: string;
  first_name: string;
  last_name: string;
  email: string;
}

export interface ILoginData {
  username: string;
  password: string;
}

export interface IApiResponse {
  error: boolean;
  result: any;
  statusCode: number;
}

export class ApiClient {
  private marketsEndpoint = "/api/v1/markets/";
  private settingsEndpoint = "/api/v1/settings/";
  private registerUserEndpoint = "/auth/register/";
  private loginUserEndpoint = "/auth/api-token-auth/";

  private getHeaders = (authenticated = false) => {
    const storedToken = localStorage.getItem("token");
    console.debug(storedToken);
    let headers: HttpRequestHeader = {
      "Content-Type": "application/json",
      Accept: "application/json"
    };
    if (authenticated) {
      headers["Authorization"] = "Token " + storedToken;
    }
    return headers;
  };

  private makeGetRequest = async (path: string, authenticated = false) => {
    const controller = new AbortController();
    const { signal } = controller;

    const response = await fetch(path, {
      method: "GET",
      headers: this.getHeaders(authenticated),
      signal
    });
    // Wait 2 seconds to abort both requests
    setTimeout(() => controller.abort(), 2000);
    if (!response.ok) {
      const message = `An error has occured: ${response.status}`;
      throw new Error(message);
    }
    const content = await response.json();
    return content;
  };

  private makePostRequest = async (
    path: string,
    data: any,
    authenticated = false
  ) => {
    const controller = new AbortController();
    const { signal } = controller;
    let error = false;

    const response = await fetch(path, {
      method: "POST",
      headers: this.getHeaders(authenticated),
      body: JSON.stringify(data),
      signal
    });
    // Wait 2 seconds to abort both requests
    setTimeout(() => controller.abort(), 2000);
    if (!response.ok) {
      error = true;
    }
    const content = await response.json();
    return { error, result: content, statusCode: response.status };
  };

  getMarkets = async () => {
    const result = await this.makeGetRequest(this.marketsEndpoint, true);
    return result;
  };

  getSettings = async () => {
    const result = await this.makeGetRequest(this.settingsEndpoint, true);
    return result;
  };

  registerUser = async (
    registrationData: IRegistrationData
  ): Promise<IApiResponse> => {
    try {
      const result = await this.makePostRequest(
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
      const result = await this.makePostRequest(
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

export default ApiClient;
