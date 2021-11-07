import { IApiResponse, IRegistrationData } from "api/api-client";
import { createContext } from "react";

export type AuthContextType = {
  isLoading: boolean;
  isAuthenticated: boolean;
  token: string;
  // eslint-disable-next-line no-unused-vars
  register: (data: IRegistrationData) => Promise<IApiResponse> | undefined;
  // eslint-disable-next-line no-unused-vars
  signin: (username: string, password: string) => void;
  signout: () => null;
};

export const authDefaultValue: AuthContextType = {
  isLoading: false,
  isAuthenticated: false,
  token: "",
  register: () => undefined,
  signin: () => undefined,
  signout: (): null => null
};

export const AuthContext = createContext<AuthContextType>(authDefaultValue);
