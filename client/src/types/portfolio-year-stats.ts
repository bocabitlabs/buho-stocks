export interface IPortfolioYearStats {
  company: {
    id: number;
    name: string;
    ticker: string;
    baseCurrency: string;
    dividendsCurrency: string;
  };
  year: number;
  invested: number;
  dividends: number;
  dividendsYield: number;
  sharesCount: number;
  portfolioCurrency: string;
  accumulatedInvestment: number;
  accumulatedDividends: number;
  portfolioValue: number;
  returnValue: number;
  returnPercent: number;
  returnWithDividends: number;
  returnWithDividendsPercent: number;
}
