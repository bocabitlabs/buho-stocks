export interface ISettingsFormFields {
  companySortBy?: string;
  companyDisplayMode?: string;
  displayWelcome?: boolean;
  language?: string;
  mainPortfolio?: string;
  portfolioSortBy?: string;
  portfolioDisplayMode?: string;
  sentryDsn?: string;
  sentryEnabled?: boolean;
  timezone?: string;
}

export interface ISettings extends ISettingsFormFields {
  id: number;
  allowFetch: boolean;
  dateCreated: string;
  lastUpdated: string;
}
