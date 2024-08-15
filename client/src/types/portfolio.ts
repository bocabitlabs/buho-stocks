import { ICompanyListItem } from "./company";
import { ICurrency } from "./currency";

interface IPortfolioBase {
  name: string;
  description: string;
  color: string;
  hideClosedCompanies: boolean;
  countryCode: string;
}

export interface IPortfolioFormFields extends IPortfolioBase {
  baseCurrency: number | null;
}

export interface IPortfolio extends IPortfolioBase {
  id: number;
  baseCurrency: ICurrency;
  firstYear: number;
  companies: ICompanyListItem[];
  dateCreated: string;
  lastUpdated: string;
}

export interface IPortfolioRouteParams {
  computedMatch: {
    params: {
      id: string;
    };
  };
}
