import { Transaction, TransactionType } from "types/transaction";

export interface ISharesTransactionFormFields extends Transaction {
  type: TransactionType;
}

export interface ISharesTransaction extends ISharesTransactionFormFields {
  id: number;
  dateCreated: string;
  lastUpdated: string;
}
