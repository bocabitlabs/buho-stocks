import { Transaction, TransactionType } from "types/transaction";

export interface IRightsTransactionFormFields extends Transaction {
  type: TransactionType;
}

export interface IRightsTransaction extends IRightsTransactionFormFields {
  id: string;
  dateCreated: string;
  lastUpdated: string;
}
