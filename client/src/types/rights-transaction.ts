import { Transaction, TransactionType } from "types/transaction";

export interface IRightsTransactionFormFields extends Transaction {
  type: TransactionType;
}

export interface IRightsTransaction extends IRightsTransactionFormFields {
  id: number;
  dateCreated: string;
  lastUpdated: string;
}
