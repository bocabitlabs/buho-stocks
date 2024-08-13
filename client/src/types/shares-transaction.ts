import { TransactionType } from "types/transaction";

export interface ISharesTransactionFormFields {
  count: number;
  totalAmount: number;
  totalAmountCurrency: string;
  grossPricePerShare: number;
  grossPricePerShareCurrency: string;
  totalCommission: number;
  totalCommissionCurrency: string;
  exchangeRate: number;
  transactionDate: Date;
  company: number;
  notes: string;
  type: TransactionType;
  transactionType?: string;
}

export interface ISharesTransaction extends ISharesTransactionFormFields {
  id: number;
  dateCreated: string;
  lastUpdated: string;
}

export interface ITradeCsv {
  date: string;
  count: number;
  price: number;
  currency: string;
  totalWithCommission: number;
  commission: number;
  description: string;
  ticker: string;
  companyName: string;
  companyISIN: string;
  market: string;
}
