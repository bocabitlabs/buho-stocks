export interface Transaction {
  count: number;
  grossPricePerShare: number;
  grossPricePerShareCurrency: string;
  totalCommission: number;
  totalCommissionCurrency: string;
  exchangeRate: number;
  transactionDate: string;
  company: number;
  color: string;
  notes: string;
  portfolio: number;
}

export type TransactionType = "BUY" | "SELL";
