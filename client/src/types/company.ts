import { CompanyYearStats } from "./company-year-stats";
import { ICurrency } from "./currency";
import { IDividendsTransaction } from "./dividends-transaction";
import { IMarket } from "./market";
import { IPortfolioLite } from "./portfolio-lite";
import { IRightsTransaction } from "./rights-transaction";
import { ISector } from "./sector";
import { ISharesTransaction } from "./shares-transaction";

interface ICompanyBase {
  name: string;
  ticker: string;
  altTickers: string;
  description: string;
  url: string;
  color: string;
  broker: string;
  countryCode: string;
  isClosed: boolean;
  isin: string;
  logo?: string;
}

export interface ICompanyFormFields extends ICompanyBase {
  baseCurrency: string;
  dividendsCurrency: number;
  sector: number;
  market: number;
  portfolio: number;
}

export interface ICompanyItemBase extends ICompanyBase {
  id: number;
  sector: ISector;
  market: IMarket;
  portfolio: IPortfolioLite;
  sharesTransactions: ISharesTransaction[];
  rightsTransactions: IRightsTransaction[];
  dividendsTransactions: IDividendsTransaction[];
  dateCreated: string;
  lastUpdated: string;
  allStats: any;
  stats: any;
  firstYear: number;
  lastTransactionMonth: string;
  lastDividendMonth: string;
}

export interface ICompany extends ICompanyItemBase {
  baseCurrency: ICurrency;
  dividendsCurrency: ICurrency;
  allStats: CompanyYearStats;
  sharesCount: number;
}

export interface ICompanyListItem extends ICompanyItemBase {
  baseCurrency: string;
  dividendsCurrency: string;
  sectorName: string;
}

export interface ICompanyRouteParams {
  computedMatch: {
    params: {
      id: string;
      companyId: string;
    };
  };
}
