import { useCallback, useContext, useState } from "react";
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router-dom";
import { message } from "antd";
import { IApiResponse, ILoginData, IRegistrationData } from "api/api-client";
import { AuthContext } from "contexts/auth";
import { LoginActionsHookType } from "contexts/login-actions";
import { useApi } from "hooks/use-api/use-api-hook";
import getRoute, { LOGIN_ROUTE } from "routes";

export function useLoginActions(): LoginActionsHookType {
  const [isLoading, setIsLoading] = useState(false);
  const {
    clearToken,
    authenticate,
    prueba: pruebaAuth,
    state
  } = useContext(AuthContext);
  const history = useHistory();
  const { t } = useTranslation();
  const api = useApi();
  const loginUserEndpoint = "/auth/api-token-auth/";
  const registerUserEndpoint = "/auth/register/";

  const loginUser = async ({
    username,
    password
  }: ILoginData): Promise<any> => {
    try {
      const response = api.post(loginUserEndpoint, { username, password });
      return await response;
    } catch (error) {
      return { error: true, result: error, statusCode: 0 };
    }
  };

  const registerUser = async ({
    username,
    password
  }: IRegistrationData): Promise<any> => {
    try {
      const response = api.post(registerUserEndpoint, { username, password });
      return await response;
    } catch (error) {
      return { error: true, result: error, statusCode: 0 };
    }
  };

  const signin = async (username: string, password: string) => {
    setIsLoading(true);
    const data = {
      username,
      password
    };

    const response = await loginUser(data);

    console.log(response);
    if (response?.error) {
      message.error({
        content: t(`Error ${response.statusCode}: Unable to log in`)
      });
      return false;
    }
    authenticate(response.token);
    // message.success({ content: t("You are logged in") });
    // const { from } = location.state || { from: { pathname: "/" } };
    // console.log("Redirecting to", from);
    setIsLoading(false);
    console.log(state);
    return true;
  };

  const register = async (data: IRegistrationData): Promise<IApiResponse> => {
    setIsLoading(true);
    const response = await registerUser(data);
    if (response?.error) {
      message.error({
        content: t(`Error ${response.statusCode}: Unable to create user`)
      });
      return response;
    }
    setIsLoading(false);
    message.success({ content: t("User created") });
    history.push(getRoute(LOGIN_ROUTE));
    return response;
  };

  const signout = useCallback(() => {
    setIsLoading(true);
    localStorage.removeItem("token");
    clearToken();
    setIsLoading(false);
    history.push(getRoute(LOGIN_ROUTE));
    return null;
  }, [history, clearToken]);

  const prueba = () => {
    setIsLoading(true);
    console.debug("Calling prueba");
    // const { from } = location.state || { from: { pathname: "/" } };
    // console.log("Redirecting to", from);
    pruebaAuth();
    console.log(state);
    setIsLoading(false);
    return null;
  };

  return {
    isLoading,
    register,
    signin,
    signout,
    prueba
  };
}

export default useLoginActions;
