export interface ICurrencyFormFields {
  name: string;
  code: string;
  symbol: string;
}

export interface ICurrency extends ICurrencyFormFields {
  dateCreated: string;
  lastUpdated: string;
  id: number;
}
