export enum IAlertMessageType {
  Success = "success",
  Info = "info",
  Warning = "warning",
  Error = "error"
}

export interface IAlertMessageFormFields {
  type: IAlertMessageType;
  text: string;
}

export default interface IAlertMessage extends IAlertMessageFormFields {
  id: number;
}
