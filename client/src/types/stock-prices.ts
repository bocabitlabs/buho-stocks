export interface IStockPriceFormFields {
  ticker: string;
  transactionDate: Date;
  price: number;
  priceCurrency: string;
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
