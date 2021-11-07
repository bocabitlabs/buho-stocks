import { message } from "antd";
import { IApiResponse, IRegistrationData } from "api/api-client";
import { AuthContextType } from "contexts/auth";
import { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useHistory, useLocation } from "react-router-dom";
import getRoute, { HOME_ROUTE, LOGIN_ROUTE } from "routes";
import AuthService from "services/auth/auth-service";

interface LocationState {
  from: {
    pathname: string;
  };
}

export function useAuthContext(): AuthContextType {
  const [isLoading, setIsLoading] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [token, setToken] = useState("");
  const history = useHistory();
  const { t } = useTranslation();
  const location = useLocation<LocationState>();

  useEffect(() => {
    setIsLoading(true);
    const storedToken = localStorage.getItem("token");
    if (storedToken) {
      setIsAuthenticated(true);
    }
    setIsLoading(false);
  }, [history, location.state]);

  const signin = async (username: string, password: string) => {
    const data = {
      username,
      password
    };

    const response = await new AuthService().loginUser(data);
    if (response.error) {
      return response;
    }
    setIsAuthenticated(true);
    localStorage.setItem("token", response.result.token);
    setToken(response.result);
    history.push(getRoute(HOME_ROUTE));
    if (response?.error) {
      message.error({
        content: t(`Error ${response.statusCode}: Unable to log in`)
      });
      return response;
    }
    message.success({ content: t("You are logged in") });
    const { from } = location.state || { from: { pathname: "/" } };
    history.push(from);
    return true;
  };

  const register = async (data: IRegistrationData): Promise<IApiResponse> => {
    const response = await new AuthService().registerUser(data);
    if (response?.error) {
      message.error({
        content: t(`Error ${response.statusCode}: Unable to create user`)
      });
      return response;
    }
    message.success({ content: t("User created") });

    history.push(getRoute(LOGIN_ROUTE));
    return response;
  };

  const signout = useCallback(() => {
    setToken("");
    setIsAuthenticated(false);
    localStorage.setItem("token", "");
    history.push(getRoute(LOGIN_ROUTE));
    return null;
  }, [history]);

  return {
    isLoading,
    isAuthenticated,
    token,
    register,
    signin,
    signout
  };
}

export default useAuthContext;
