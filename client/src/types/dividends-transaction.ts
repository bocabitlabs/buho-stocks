import { Transaction } from "types/transaction";

export interface IDividendsTransactionFormFields extends Transaction {
  // Transaction
}

export interface IDividendsTransaction extends IDividendsTransactionFormFields {
  id: number;
  dateCreated: string;
  lastUpdated: string;
}
