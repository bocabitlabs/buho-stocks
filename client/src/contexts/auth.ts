import { IApiResponse, IRegistrationData } from "api/api-client";
import { createContext } from "react";

export type AuthContextType = {
  isAuthenticated: boolean;
  token: string;
  register: (data: IRegistrationData) => Promise<IApiResponse>| undefined;
  signin: (username: string, password: string) => Promise<IApiResponse>| undefined;
  signout: () => null;
};

export const authDefaultValue: AuthContextType = {
  isAuthenticated: false,
  token: "",
  register: () => undefined,
  signin: () => undefined,
  signout: (): null => null
};

export const AuthContext = createContext<AuthContextType>(authDefaultValue);
