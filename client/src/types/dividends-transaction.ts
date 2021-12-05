import { Transaction } from "types/transaction";

export interface IDividendsTransactionFormFields extends Transaction {
  // Transaction
}

export interface IDividendsTransaction extends IDividendsTransactionFormFields {
  id: string;
  dateCreated: string;
  lastUpdated: string;
}
