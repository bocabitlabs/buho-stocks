export interface ICsvDataObject {
  data: string[][];
}

export interface ICsvDividendRow {
  id: string;
  date: string;
  amount: number;
  currency: string;
  commissions: number;
  description: string;
  ticker: string;
  companyName: string;
  isin: string;
  market: string;
}

export interface ICsvTradesRow {
  id: string;
  transactionType: string;
  date: string;
  ticker: string;
  companyName: string;
  companyISIN: string;
  market: string;
  currency: string;
  count: number;
  price: number;
  total: number;
  commission: number;
  totalWithCommission: number;
  category: string;
  description: string;
}

export interface ICsvCorporateActionsRow {
  id: string;
  transactionType: string;
  date: string;
  ticker: string;
  companyName: string;
  isin: string;
  market: string;
  currency: string;
  count: number;
  price: number;
  total: number;
  commission: number;
  totalWithCommission: number;
  category: string;
  description: string;
}
