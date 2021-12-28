import { useCallback, useContext } from "react";
import { useNavigate } from "react-router-dom";
import useFetch from "use-http";
import { ILoginData, IRegistrationData } from "api/api-client";
import { AuthContext } from "contexts/auth";
import { LoginActionsHookType } from "contexts/login-actions";
import { LOGIN_ROUTE } from "routes";

export function useLoginActions(): LoginActionsHookType {
  const {
    clearToken,
    authenticate,
    prueba: pruebaAuth,
  } = useContext(AuthContext);
  const navigate = useNavigate();
  const endpoint = "/auth/";

  const getHeaders = useCallback(() => {
    const headers = {
      Accept: "application/json",
      Authorization: `Token ${localStorage.getItem("token")}`,
    };
    return headers;
  }, []);
  const {
    response,
    post,
    error,
    loading: isLoading,
  } = useFetch(endpoint, {
    headers: getHeaders(),
  });

  const loginUser = useCallback(
    async ({ username, password }: ILoginData): Promise<any> => {
      const responseValues = await post("api-token-auth/", {
        username,
        password,
      });
      if (response.ok) {
        return responseValues;
      }
      console.error(error);

      return response;
    },
    [post, error, response],
  );

  const registerUser = useCallback(
    async (data: IRegistrationData): Promise<any> => {
      const responseValues = post("register/", data);
      if (response.ok) {
        return responseValues;
      }
      console.error(error);

      return response;
    },
    [post, error, response],
  );

  const signin = useCallback(
    async (username: string, password: string) => {
      const data = {
        username,
        password,
      };
      const values = await loginUser(data);
      if (response.ok) {
        authenticate(values.token);
        return true;
      }
      return false;
    },
    [loginUser, authenticate, response.ok],
  );

  const register = useCallback(
    async (data: IRegistrationData) => {
      await registerUser(data);
      return response;
    },
    [registerUser, response],
  );

  const signout = useCallback(() => {
    localStorage.removeItem("token");
    clearToken();
    navigate(LOGIN_ROUTE);
    return null;
  }, [clearToken, navigate]);

  const prueba = () => {
    console.debug("Calling prueba");
    pruebaAuth();
    return null;
  };

  return {
    isLoading,
    register,
    signin,
    signout,
    prueba,
  };
}

export default useLoginActions;
