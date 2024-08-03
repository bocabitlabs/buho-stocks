// const APP_BASE_ROUTE = "/";

// const HOME_ROUTE = "home";
// const SETTINGS_ROUTE = "settings";

// const BENCHMARKS_ROUTE = "benchmarks";

// const COMPANIES_ADD_ROUTE = "portfolios/:id/companies/add";
// const COMPANIES_DETAILS_ROUTE = "portfolios/:id/companies/:companyId";
// const COMPANIES_EDIT_ROUTE = "portfolios/:id/companies/:companyId/edit";

// const CURRENCIES_ROUTE = "currencies";

// const EXCHANGE_RATES = "exchange-rates";

// const MARKETS_ROUTE = "markets";
// const MARKETS_DETAILS_ROUTE = "markets/:id";

// const PORTFOLIOS_ROUTE = "portfolios";
// const PORTFOLIOS_ADD_ROUTE = "portfolios/add";
// const PORTFOLIOS_DETAILS_ROUTE = "portfolios/:id";
// const PORTFOLIOS_EDIT_ROUTE = "portfolios/:id/edit";

// const SECTORS_ROUTE = "sectors";
// const SECTORS_DETAILS_ROUTE = "sectors/:id";

// const SHARES_ADD_ROUTE = "portfolios/:id/companies/:companyId/shares/add";
// const SHARES_EDIT_ROUTE =
//   "portfolios/:id/companies/:companyId/shares/:transactionId";

// const RIGHTS_ADD_ROUTE = "portfolios/:id/companies/:companyId/rights/add";
// const RIGHTS_EDIT_ROUTE =
//   "portfolios/:id/companies/:companyId/rights/:transactionId";

// const STOCK_PRICES = "stock-prices";

// const DIVIDENDS_ADD_ROUTE = "portfolios/:id/companies/:companyId/dividends/add";
// const DIVIDENDS_EDIT_ROUTE =
//   "portfolios/:id/companies/:companyId/dividends/:transactionId";

// const getRoute = (route: string): string => {
//   return APP_BASE_ROUTE + route;
// };

// export default getRoute;

// export {
//   APP_BASE_ROUTE,
//   BENCHMARKS_ROUTE,
//   COMPANIES_ADD_ROUTE,
//   COMPANIES_DETAILS_ROUTE,
//   COMPANIES_EDIT_ROUTE,
//   CURRENCIES_ROUTE,
//   DIVIDENDS_ADD_ROUTE,
//   DIVIDENDS_EDIT_ROUTE,
//   EXCHANGE_RATES,
//   HOME_ROUTE,
//   SETTINGS_ROUTE,
//   MARKETS_ROUTE,
//   MARKETS_DETAILS_ROUTE,
//   PORTFOLIOS_ROUTE,
//   PORTFOLIOS_ADD_ROUTE,
//   PORTFOLIOS_DETAILS_ROUTE,
//   PORTFOLIOS_EDIT_ROUTE,
//   RIGHTS_ADD_ROUTE,
//   RIGHTS_EDIT_ROUTE,
//   SECTORS_ROUTE,
//   SECTORS_DETAILS_ROUTE,
//   SHARES_ADD_ROUTE,
//   SHARES_EDIT_ROUTE,
//   STOCK_PRICES,
// };

const appBaseRoute = "/";
const homeRoute = "";
const settingsRoute = "settings/";
const benchmarksRoute = "benchmarks/";
const companiesAddRoute = "portfolios/:id/companies/add/";
const companiesDetailsRoute = "portfolios/:id/companies/:companyId/";
const currenciesRoute = "currencies/";
const importCsvRoute = "import/";
const marketsRoute = "markets/";
const sectorsRoute = "sectors/";
const portfoliosRoute = "portfolios/";
const portfoliosAddRoute = "portfolios/add/";
const portfoliosDetailsRoute = "portfolios/:id/";
const portfoliosLogsRoute = "portfolios/:id/logs/";
const portfoliosChartsRoute = "portfolios/:id/charts/";

const getRouteWithBase = (route: string) => `/${appBaseRoute}/${route}`;

export default {
  appBaseRoute,
  homeRoute,
  settingsRoute,
  benchmarksRoute,
  companiesAddRoute,
  companiesDetailsRoute,
  currenciesRoute,
  importCsvRoute,
  marketsRoute,
  sectorsRoute,
  portfoliosRoute,
  portfoliosAddRoute,
  portfoliosDetailsRoute,
  portfoliosLogsRoute,
  portfoliosChartsRoute,
  getRouteWithBase,
};
