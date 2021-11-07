export interface HttpRequestHeader {
  [key: string]: string;
}

export interface IRegistrationData {
  username: string;
  password: string;
  password2: string;
  firstName: string;
  lastName: string;
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
  private getHeaders = (authenticated = false) => {
    const storedToken = localStorage.getItem("token");
    const headers: HttpRequestHeader = {
      "Content-Type": "application/json",
      Accept: "application/json"
    };
    if (authenticated) {
      headers.Authorization = `Token ${storedToken}`;
    }
    return headers;
  };

  makeGetRequest = async (path: string, authenticated = false) => {
    const controller = new AbortController();
    const { signal } = controller;
    let error = false;

    const response = await fetch(path, {
      method: "GET",
      headers: this.getHeaders(authenticated),
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

  makePostRequest = async (path: string, data: any, authenticated = false) => {
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

  makePutRequest = async (
    path: string,
    id: number,
    data: any,
    authenticated = false
  ) => {
    const controller = new AbortController();
    const { signal } = controller;
    let error = false;

    const response = await fetch(`${path + id}/`, {
      method: "PUT",
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

  makeDeleteRequest = async (
    path: string,
    id: number,
    authenticated = false
  ) => {
    const controller = new AbortController();
    const { signal } = controller;
    let error = false;

    const response = await fetch(`${path + id}/`, {
      method: "DELETE",
      headers: this.getHeaders(authenticated),
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
}

export default ApiClient;
