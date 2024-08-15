export interface IExchangeRateFormFields {
  exchangeDate: Date;
  exchangeRate: number;
  exchangeFrom: string;
  exchangeTo: string;
}

export interface IExchangeRate extends IExchangeRateFormFields {
  id: number;
  dateCreated: string;
  lastUpdated: string;
}

export interface IExchangeRateListResponse {
  count: number;
  next: string;
  previous: number;
  results: IExchangeRate[];
}
