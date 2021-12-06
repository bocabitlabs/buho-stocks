export interface ILogMessageFormFields {
  messageText: string;
  messageType: string;
  portfolio: number;
}

export interface ILogMessage extends ILogMessageFormFields {
  id: number;
  dateCreated: string;
  lastUpdated: string;
}
