export interface ISettingsFormFields{
  language: string;
  companySortBy: string;
  companyDisplayMode: string;
  mainPortfolio: string;
  portfolioSortBy: string;
  portfolioDisplayMode: string;
}

export interface ISettings extends ISettingsFormFields {
  dateCreated: string;
  lastUpdated: string;
}
