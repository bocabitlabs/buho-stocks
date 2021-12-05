export interface ICurrencyFormFields {
  name: string;
  code: string;
  countries: string;
  symbol: string;
}

export interface ICurrency extends ICurrencyFormFields {
  dateCreated: string;
  lastUpdated: string;
}
