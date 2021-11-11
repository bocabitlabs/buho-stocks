import { IApiResponse, IRegistrationData } from "api/api-client";

export type LoginActionsHookType = {
  isLoading: boolean;
  // eslint-disable-next-line no-unused-vars
  register: (data: IRegistrationData) => Promise<IApiResponse> | undefined;
  // eslint-disable-next-line no-unused-vars
  signin: (username: string, password: string) => Promise<boolean>;
  signout: () => null;
  prueba: () => null;
};
