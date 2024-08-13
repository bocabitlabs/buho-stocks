import { TransactionType } from "types/transaction";

export interface IRightsTransactionFormFields {
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

export interface IRightsTransaction extends IRightsTransactionFormFields {
  id: number;
  dateCreated: string;
  lastUpdated: string;
}
