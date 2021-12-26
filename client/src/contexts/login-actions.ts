import { IRegistrationData } from "api/api-client";

export type LoginActionsHookType = {
  isLoading: boolean;
  // eslint-disable-next-line no-unused-vars
  register: (data: IRegistrationData) => Promise<any> | undefined;
  // eslint-disable-next-line no-unused-vars
  signin: (username: string, password: string) => Promise<any>;
  signout: () => null;
  prueba: () => null;
};
