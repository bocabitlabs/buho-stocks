import { useCallback } from "react";
import { message } from "antd";
import { useAuthContext } from "hooks/use-auth/use-auth-context";

export function useApi() {
  const { state, clearToken } = useAuthContext();

  const authHeader = useCallback(
    (url: string) => {
      console.log(url);
      if (
        state.isAuthenticated
        // && isApiUrl
      ) {
        return { Authorization: `Token ${state.token}` };
      }
      return {};
    },
    [state.isAuthenticated, state.token]
  );

  const handleResponse = useCallback(
    (response: any) => {
      return response.text().then((text: string) => {
        const data = text && JSON.parse(text);
        if (!response.ok) {
          if ([401, 403].includes(response.status) || !state.token) {
            // auto logout if 401 Unauthorized or 403 Forbidden response returned from api
            console.log("clearing token");
            clearToken();
          }
          const error = (data && data.message) || response.statusText;
          message.error(error);
          return Promise.reject(error);
        }
        return data;
      });
    },
    [clearToken, state.token]
  );

  const request = useCallback(
    (method: string) => {
      return (url: string, body?: any) => {
        const requestOptions: any = {
          method,
          headers: authHeader(url)
        };
        console.log(requestOptions);
        if (body) {
          requestOptions.headers["Content-Type"] = "application/json";
          requestOptions.body = JSON.stringify(body);
        }
        let requestUrl = url;
        if (!requestUrl.endsWith("/")) {
          requestUrl += "/";
        }
        return fetch(requestUrl, requestOptions).then(handleResponse);
      };
    },
    [authHeader, handleResponse]
  );

  const get = useCallback(
    (url: string, body?: any) => {
      return request("GET")(url, body);
    },
    [request]
  );

  return {
    get,
    post: request("POST"),
    put: request("PUT"),
    delete: request("DELETE")
  };
}

export default useApi;
