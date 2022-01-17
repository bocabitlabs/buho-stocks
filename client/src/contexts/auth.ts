import { createContext } from "react";

interface MyState {
  isAuthenticated: boolean;
  token: any;
}

export type AuthContextType = {
  state: MyState;
  // eslint-disable-next-line no-unused-vars
  // register: (data: IRegistrationData) => Promise<IApiResponse> | undefined;
  // eslint-disable-next-line no-unused-vars
  clearToken: () => void;
  authenticate: (newToken: string) => void;
};

export const authDefaultValue: AuthContextType = {
  state: { isAuthenticated: false, token: null },
  clearToken: () => undefined,
  authenticate: (): null => null,
};

export const AuthContext = createContext<AuthContextType>(authDefaultValue);
