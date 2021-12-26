const APP_BASE_ROUTE = "/app";
const LOGIN_ROUTE = "/app-login";
const REGISTER_ROUTE = "/register";

const HOME_ROUTE = "/home";
const SETTINGS_ROUTE = "/settings";

const COMPANIES_ADD_ROUTE = "/portfolios/:id/companies/add";
const COMPANIES_DETAILS_ROUTE = "/portfolios/:id/companies/:companyId";
const COMPANIES_EDIT_ROUTE = "/portfolios/:id/companies/:companyId/edit";

const CURRENCIES_ROUTE = "/currencies";
const CURRENCIES_ADD_ROUTE = "/currencies/add";
const CURRENCIES_DETAILS_ROUTE = "/currencies/:id";
const CURRENCIES_EDIT_ROUTE = "/currencies/:id/edit";

const MARKETS_ROUTE = "/markets";
const MARKETS_ADD_ROUTE = "/markets/add";
const MARKETS_DETAILS_ROUTE = "/markets/:id";
const MARKETS_EDIT_ROUTE = "/markets/:id/edit";

const PORTFOLIOS_ROUTE = "/portfolios";
const PORTFOLIOS_ADD_ROUTE = "/portfolios/add";
const PORTFOLIOS_DETAILS_ROUTE = "/portfolios/:id";
const PORTFOLIOS_EDIT_ROUTE = "/portfolios/:id/edit";

const SECTORS_ROUTE = "/sectors";
const SECTORS_ADD_ROUTE = "/sectors/add";
const SECTORS_DETAILS_ROUTE = "/sectors/:id";
const SECTORS_EDIT_ROUTE = "/sectors/:id/edit";

const SHARES_ADD_ROUTE = "/portfolios/:id/companies/:companyId/shares/add";
const SHARES_EDIT_ROUTE =
  "/portfolios/:id/companies/:companyId/shares/:transactionId";

const RIGHTS_ADD_ROUTE = "/portfolios/:id/companies/:companyId/rights/add";
const RIGHTS_EDIT_ROUTE =
  "/portfolios/:id/companies/:companyId/rights/:transactionId";

const DIVIDENDS_ADD_ROUTE =
  "/portfolios/:id/companies/:companyId/dividends/add";
const DIVIDENDS_EDIT_ROUTE =
  "/portfolios/:id/companies/:companyId/dividends/:transactionId";

const getRoute = (route: string): string => {
  return APP_BASE_ROUTE + route;
};

export default getRoute;

export {
  APP_BASE_ROUTE,
  COMPANIES_ADD_ROUTE,
  COMPANIES_DETAILS_ROUTE,
  COMPANIES_EDIT_ROUTE,
  CURRENCIES_ROUTE,
  CURRENCIES_ADD_ROUTE,
  CURRENCIES_DETAILS_ROUTE,
  CURRENCIES_EDIT_ROUTE,
  DIVIDENDS_ADD_ROUTE,
  DIVIDENDS_EDIT_ROUTE,
  LOGIN_ROUTE,
  REGISTER_ROUTE,
  HOME_ROUTE,
  SETTINGS_ROUTE,
  MARKETS_ROUTE,
  MARKETS_ADD_ROUTE,
  MARKETS_DETAILS_ROUTE,
  MARKETS_EDIT_ROUTE,
  PORTFOLIOS_ROUTE,
  PORTFOLIOS_ADD_ROUTE,
  PORTFOLIOS_DETAILS_ROUTE,
  PORTFOLIOS_EDIT_ROUTE,
  RIGHTS_ADD_ROUTE,
  RIGHTS_EDIT_ROUTE,
  SECTORS_ROUTE,
  SECTORS_ADD_ROUTE,
  SECTORS_DETAILS_ROUTE,
  SECTORS_EDIT_ROUTE,
  SHARES_ADD_ROUTE,
  SHARES_EDIT_ROUTE
};
