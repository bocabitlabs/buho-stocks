const APP_BASE_ROUTE = "/";

const HOME_ROUTE = "home";
const SETTINGS_ROUTE = "settings";

const COMPANIES_ADD_ROUTE = "portfolios/:id/companies/add";
const COMPANIES_DETAILS_ROUTE = "portfolios/:id/companies/:companyId";
const COMPANIES_EDIT_ROUTE = "portfolios/:id/companies/:companyId/edit";

const MARKETS_ROUTE = "markets";
const MARKETS_DETAILS_ROUTE = "markets/:id";

const PORTFOLIOS_ROUTE = "portfolios";
const PORTFOLIOS_ADD_ROUTE = "portfolios/add";
const PORTFOLIOS_DETAILS_ROUTE = "portfolios/:id";
const PORTFOLIOS_EDIT_ROUTE = "portfolios/:id/edit";

const SECTORS_ROUTE = "sectors";
const SECTORS_DETAILS_ROUTE = "sectors/:id";

const SHARES_ADD_ROUTE = "portfolios/:id/companies/:companyId/shares/add";
const SHARES_EDIT_ROUTE =
  "portfolios/:id/companies/:companyId/shares/:transactionId";

const RIGHTS_ADD_ROUTE = "portfolios/:id/companies/:companyId/rights/add";
const RIGHTS_EDIT_ROUTE =
  "portfolios/:id/companies/:companyId/rights/:transactionId";

const DIVIDENDS_ADD_ROUTE = "portfolios/:id/companies/:companyId/dividends/add";
const DIVIDENDS_EDIT_ROUTE =
  "portfolios/:id/companies/:companyId/dividends/:transactionId";

const getRoute = (route: string): string => {
  return APP_BASE_ROUTE + route;
};

export default getRoute;

export {
  APP_BASE_ROUTE,
  COMPANIES_ADD_ROUTE,
  COMPANIES_DETAILS_ROUTE,
  COMPANIES_EDIT_ROUTE,
  DIVIDENDS_ADD_ROUTE,
  DIVIDENDS_EDIT_ROUTE,
  HOME_ROUTE,
  SETTINGS_ROUTE,
  MARKETS_ROUTE,
  MARKETS_DETAILS_ROUTE,
  PORTFOLIOS_ROUTE,
  PORTFOLIOS_ADD_ROUTE,
  PORTFOLIOS_DETAILS_ROUTE,
  PORTFOLIOS_EDIT_ROUTE,
  RIGHTS_ADD_ROUTE,
  RIGHTS_EDIT_ROUTE,
  SECTORS_ROUTE,
  SECTORS_DETAILS_ROUTE,
  SHARES_ADD_ROUTE,
  SHARES_EDIT_ROUTE,
};
