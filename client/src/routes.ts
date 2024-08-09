const appBaseRoute = "/";
const homeRoute = "";
const settingsRoute = "settings/";
const benchmarksRoute = "benchmarks/";
const companiesDetailsRoute = ":id/companies/:companyId/";
const currenciesRoute = "currencies/";
const importCsvRoute = "import/";
const marketsRoute = "markets/";
const sectorsRoute = "sectors/";
const portfoliosRoute = "portfolios/";
const portfoliosDetailsRoute = ":id/";
const portfoliosLogsRoute = ":id/logs/";
const portfoliosChartsRoute = ":id/charts/";

const getRouteWithBase = (route: string) => `/${appBaseRoute}/${route}`;

export default {
  appBaseRoute,
  homeRoute,
  settingsRoute,
  benchmarksRoute,
  companiesDetailsRoute,
  currenciesRoute,
  importCsvRoute,
  marketsRoute,
  sectorsRoute,
  portfoliosRoute,
  portfoliosDetailsRoute,
  portfoliosLogsRoute,
  portfoliosChartsRoute,
  getRouteWithBase,
};
