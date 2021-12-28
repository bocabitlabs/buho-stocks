import { createContext } from "react";

interface MyState {
  isAuthenticated: boolean;
  token: any;
}

export type AuthContextType = {
  state: MyState;
  isWorking: boolean;
  // eslint-disable-next-line no-unused-vars
  // register: (data: IRegistrationData) => Promise<IApiResponse> | undefined;
  // eslint-disable-next-line no-unused-vars
  clearToken: () => void;
  authenticate: (newToken: string) => void;
  prueba: () => void;
  updateIsWorking: () => void;
};

export const authDefaultValue: AuthContextType = {
  state: { isAuthenticated: false, token: null },
  isWorking: false,
  clearToken: () => undefined,
  authenticate: (): null => null,
  prueba: () => null,
  updateIsWorking: () => "pepe",
};

export const AuthContext = createContext<AuthContextType>(authDefaultValue);
