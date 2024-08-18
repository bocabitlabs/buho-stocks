export interface ITimezone {
  name: string;
}

export interface IMarketFormFields {
  name: string;
  description: string;
  color: string;
  region: string;
  openTime: Date | string;
  closeTime: Date | string;
  timezone: string;
}

export interface IMarket extends IMarketFormFields {
  id: number;
  dateCreated: string;
  lastUpdated: string;
}
