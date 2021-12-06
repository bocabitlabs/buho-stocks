import { createContext } from "react";
import { ILogMessage } from "types/log-messages";

export type LogMessagesContextType = {
  isLoading: boolean;
  logMessages: ILogMessage[] | [];
  logMessage: ILogMessage | null;
  // create: (newValues: ILogMessageFormFields) => void;
  getAll: () => void;
  getById: (id: number) => void;
  deleteById: (id: number) => void;
  // update: (id: number, newValues: ILogMessageFormFields) => void;
};

export const defaultValue: LogMessagesContextType = {
  isLoading: false,
  logMessages: [],
  logMessage: null,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  // create: (newValues: ILogMessageFormFields) => undefined,
  getAll: () => [],
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  getById: (marketId: number) => undefined,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  deleteById: (id: number) => undefined
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  // update: (id: number, newValues: ILogMessageFormFields) => undefined
};

export const LogMessagesContext =
  createContext<LogMessagesContextType>(defaultValue);
