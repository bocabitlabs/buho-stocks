import { createContext } from "react";
import { LocationState } from "types/location";

export type AuthContextType = {
  isAuthenticated: boolean;
  token: string;
  signin: (username: string, password: string, from: LocationState) => void;
  signout: () => null;
};

export const authDefaultValue: AuthContextType = {
  isAuthenticated: false,
  token: "",
  signin: () => null,
  signout: (): null => null
};

export const AuthContext = createContext<AuthContextType>(authDefaultValue);
