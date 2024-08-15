export interface CompanyForYearStats {
  id: number;
  name: string;
  ticker: string;
  baseCurrency: string;
  dividendsCurrency: string;
}

export interface CompanyYearStats {
  year: number;
  company: CompanyForYearStats;
  sectorName: string;
  superSectorName: string;
  currencyCode: string;
  marketName: string;
  broker: string;
  sharesCount: number;
  invested: string;
  dividends: string;
  dividendsYield: string;
  portfolioCurrency: string;
  accumulatedInvestment: string;
  accumulatedDividends: string;
  stockPriceValue: string;
  stockPriceCurrency: string;
  stockPriceTransactionDate: string;
  portfolioValue: string;
  portfolioValueIsDown: boolean;
  returnValue: string;
  returnPercent: string;
  returnWithDividends: string;
  returnWithDividendsPercent: string;
}
