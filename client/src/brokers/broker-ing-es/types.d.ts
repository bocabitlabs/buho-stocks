export type TransactionType = "BUY" | "SELL";

export interface FormattedINGRow {
  companyName: string;
  total: number;
  transactionDate: moment.Moment;
  count: number;
  price: number;
  transactionType?: TransactionType;
}
