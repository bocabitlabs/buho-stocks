import { useCallback } from "react";
import { useHistory } from "react-router-dom";
import { message } from "antd";
import { useAuthContext } from "hooks/use-auth/use-auth-context";
import getRoute, { LOGIN_ROUTE } from "routes";

// interface LocationState {
//   from: {
//     pathname: string;
//   };
// }

export function useApi() {
  const history = useHistory();
  // const { t } = useTranslation();
  // const location = useLocation<LocationState>();
  const { state, clearToken } = useAuthContext();

  const authHeader = useCallback(
    (url: string) => {
      // return auth header with jwt if user is logged in and request is to the api url
      // const token = auth?.token;
      // const isLoggedIn = !!token;
      console.log(url);
      // const isApiUrl = url.startsWith(process.env.REACT_APP_API_URL);
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
        console.log(response);
        if (!response.ok) {
          if ([401, 403].includes(response.status) || !state.token) {
            // auto logout if 401 Unauthorized or 403 Forbidden response returned from api
            console.log("clearing token");
            clearToken();
            console.log(history);
            console.log(getRoute(LOGIN_ROUTE));
            // history.push(getRoute(LOGIN_ROUTE));
          }
          const error = (data && data.message) || response.statusText;
          message.error(error);
          return Promise.reject(error);
        }
        return data;
      });
    },
    [clearToken, state.token, history]
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
        return fetch(url, requestOptions).then(handleResponse);
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
