import { ICurrency } from "./currency";
import { IMarket } from "./market";
import { ISector } from "./sector";

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
}

export interface ICompanyFormFields extends ICompanyBase {
  currency: number;
  dividendsCurrency: number;
  sector: number;
  market: number;
  portfolio: number;
}

export interface ICompany extends ICompanyBase {
  id: number;
  currency: ICurrency;
  dividendsCurrency: ICurrency;
  sector: ISector;
  market: IMarket;
  portfolio: number;
  dateCreated: string;
  lastUpdated: string;
}

export interface ICompanyRouteParams {
  computedMatch: {
    params: {
      id: string;
      companyId: string;
    };
  };
}
