export interface IDividendsTransactionFormFields {
  totalAmount: number;
  totalAmountCurrency: string;
  totalCommission: number;
  totalCommissionCurrency: string;
  exchangeRate: number;
  transactionDate: Date;
  company: number;
  notes: string;
}

export interface IDividendsTransaction extends IDividendsTransactionFormFields {
  id: number;
  dateCreated: string;
  lastUpdated: string;
}
