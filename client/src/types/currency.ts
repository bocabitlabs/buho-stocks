export interface ICurrencyFormFields {
  name: string;
  abbreviation: string;
  color: string;
  country: string;
  symbol: string;
}

export interface ICurrency extends ICurrencyFormFields {
  id: number;
  dateCreated: string;
  lastUpdated: string;
}
