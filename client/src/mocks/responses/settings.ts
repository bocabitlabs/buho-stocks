import { ISettings } from "types/settings";

const settingsMock: ISettings = {
  id: 1,
  language: "en",
  timezone: "UTC",
  portfolioSortBy: "date",
  companySortBy: "date",
  mainPortfolio: "1",
  portfolioDisplayMode: "grid",
  companyDisplayMode: "grid",
  sentryDsn: "https://sentry.local/123456",
  sentryEnabled: true,
  lastUpdated: "2020-01-01T00:00:00.000Z",
};

export default settingsMock;
