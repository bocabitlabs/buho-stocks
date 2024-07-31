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
}

export interface ISharesTransaction extends ISharesTransactionFormFields {
  id: number;
  dateCreated: string;
  lastUpdated: string;
}
