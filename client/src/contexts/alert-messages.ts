import { createContext } from "react";
import IAlertMessage, { IAlertMessageFormFields } from "types/alert-message";

export type AlertMessagesContextType = {
  messages: IAlertMessage[] | [];
  create: (newValues: IAlertMessageFormFields) => void;
  createSuccess: (text: string) => void;
  createWarning: (text: string) => void;
  createInfo: (text: string) => void;
  createError: (text: string) => void;
  deleteById: (id: number) => void;
};

export const defaultValue: AlertMessagesContextType = {
  messages: [],
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  create: (newValues: any) => undefined,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  createSuccess: (newValues: any) => undefined,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  createError: (newValues: any) => undefined,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  createInfo: (newValues: any) => undefined,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  createWarning: (newValues: any) => undefined,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  deleteById: (id: number) => undefined
};

export const AlertMessagesContext =
  createContext<AlertMessagesContextType>(defaultValue);
