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
  logo: string;
}

export interface ICompanyFormFields extends ICompanyBase {
  baseCurrency: string;
  dividendsCurrency: number;
  sector: number;
  market: number;
  portfolio: number;
}

export interface ICompany extends ICompanyBase {
  id: number;
  baseCurrency: ICurrency;
  dividendsCurrency: ICurrency;
  sector: ISector;
  market: IMarket;
  portfolio: IPortfolioLite;
  sharesTransactions: ISharesTransaction[];
  rightsTransactions: IRightsTransaction[];
  dividendsTransactions: IDividendsTransaction[];
  dateCreated: string;
  lastUpdated: string;
  stats: any;
  firstYear: number;
}

export interface ICompanyRouteParams {
  computedMatch: {
    params: {
      id: string;
      companyId: string;
    };
  };
}
