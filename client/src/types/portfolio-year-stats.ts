export interface IPortfolioYearStats {
  year: number;
  invested: number;
  dividends: number;
  dividendsYield: number;
  portfolioCurrency: string;
  accumulatedInvestment: number;
  accumulatedDividends: number;
  portfolioValue: number;
  returnValue: number;
  returnPercent: number;
  returnWithDividends: number;
  returnWithDividendsPercent: number;
}
