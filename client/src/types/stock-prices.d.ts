export interface IStockPriceFormFields {
  ticker: string;
  transactionDate: string;
  price: number;
  priceCurrency: string;
  // exchangeRate: number;
  // exchangeFrom: string;
  // exchangeTo: string;
}

export interface IStockPrice extends IStockPriceFormFields {
  id: number;
  dateCreated: string;
  lastUpdated: string;
}

export interface IStockPriceListResponse {
  count: number;
  next: string;
  previous: number;
  results: IStockPrice[];
}
