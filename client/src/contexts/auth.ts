import { createContext } from "react";

export type AuthContextType = {
  isAuthenticated: boolean;
  token: string;
  signin: (username: string, password: string) => void;
  signout: () => null;
};

export const authDefaultValue: AuthContextType = {
  isAuthenticated: false,
  token: "",
  signin: () => null,
  signout: (): null => null
};

export const AuthContext = createContext<AuthContextType>(authDefaultValue);
