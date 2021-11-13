const APP_BASE_ROUTE = "/app";
const LOGIN_ROUTE = "/login";
const REGISTER_ROUTE = "/register";

const HOME_ROUTE = "/home";
const SETTINGS_ROUTE = "/settings";

const CURRENCIES_ROUTE = "/currencies";
const CURRENCIES_ADD_ROUTE = "/currencies/add";
const CURRENCIES_DETAILS_ROUTE = "/currencies/:id";
const CURRENCIES_EDIT_ROUTE = "/currencies/:id/edit";

const MARKETS_ROUTE = "/markets";
const MARKETS_ADD_ROUTE = "/markets/add";
const MARKETS_DETAILS_ROUTE = "/markets/:id";
const MARKETS_EDIT_ROUTE = "/markets/:id/edit";

const SECTORS_ROUTE = "/sectors";
const SECTORS_ADD_ROUTE = "/sectors/add";
const SECTORS_DETAILS_ROUTE = "/sectors/:id";
const SECTORS_EDIT_ROUTE = "/sectors/:id/edit";

const getRoute = (route: string): string => {
  return APP_BASE_ROUTE + route;
};

export default getRoute;

export {
  APP_BASE_ROUTE,
  CURRENCIES_ROUTE,
  CURRENCIES_ADD_ROUTE,
  CURRENCIES_DETAILS_ROUTE,
  CURRENCIES_EDIT_ROUTE,
  LOGIN_ROUTE,
  REGISTER_ROUTE,
  HOME_ROUTE,
  SETTINGS_ROUTE,
  MARKETS_ROUTE,
  MARKETS_ADD_ROUTE,
  MARKETS_DETAILS_ROUTE,
  MARKETS_EDIT_ROUTE,
  SECTORS_ROUTE,
  SECTORS_ADD_ROUTE,
  SECTORS_DETAILS_ROUTE,
  SECTORS_EDIT_ROUTE
};
