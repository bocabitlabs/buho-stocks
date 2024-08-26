export interface IPortfolioYearStats {
  // company: {
  //   id: number;
  //   name: string;
  //   ticker: string;
  //   baseCurrency: string;
  //   dividendsCurrency: string;
  // };
  year: number;
  invested: string;
  dividends: string;
  dividendsYield: string;
  portfolioCurrency: string;
  accumulatedInvestment: string;
  accumulatedDividends: string;
  portfolioValue: string;
  returnValue: string;
  returnPercent: string;
  returnWithDividends: string;
  returnWithDividendsPercent: string;
}
