export interface IMarketFormFields{
  name: string;
  description: string;
  color: string;
  region: string;
  openTime: string;
  closeTime: string;
}

export interface IMarket extends IMarketFormFields {
  id: number,
  dateCreated: string;
  lastUpdated: string;
}