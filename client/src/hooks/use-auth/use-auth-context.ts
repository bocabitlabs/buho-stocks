import { ApiClient, IApiResponse, IRegistrationData } from "api/api-client";
import { AuthContextType } from "contexts/auth";
import { useCallback, useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import getRoute, { HOME_ROUTE } from "routes";

export function useAuthContext(): AuthContextType {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [token, setToken] = useState("");
  let history = useHistory();

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (storedToken) {
      setIsAuthenticated(true);
      history.replace(getRoute(HOME_ROUTE));
    }
    console.log(storedToken);
  }, [history]);

  const signin = async (
    username: string,
    password: string
  ): Promise<IApiResponse> => {
    const data = {
      username: username,
      password: password
    };

    const client = new ApiClient();
    const response = await client.loginUser(data);
    if (response.error) {
      return response;
    }
    history.replace(getRoute(HOME_ROUTE));
    console.log(data);
    setIsAuthenticated(true);
    setToken(response.result);
    localStorage.setItem("token", response.result.token);
    return response;
  };

  const register = async (data: IRegistrationData): Promise<IApiResponse> => {
    const client = new ApiClient();
    const response = await client.registerUser(data);
    if (response.error) {
      return response;
    }
    history.replace("/app/login");
    return response;
  };

  const signout = useCallback(() => {
    setToken("");
    setIsAuthenticated(false);
    localStorage.setItem("token", "");
    history.replace("/app/login");
    return null;
  }, [history]);

  return {
    isAuthenticated,
    token,
    register,
    signin,
    signout
  };
}
