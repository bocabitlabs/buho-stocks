const APP_BASE_ROUTE = "/app";
const LOGIN_ROUTE = "/login";
const REGISTER_ROUTE = "/register";

const HOME_ROUTE = "/home";
const SETTINGS_ROUTE = "/settings";
const MARKETS_ROUTE = "/markets";
const MARKETS_ADD_ROUTE = "/markets/add";
const MARKETS_DETAILS_ROUTE = "/markets/:id";
const MARKETS_EDIT_ROUTE = "/markets/:id/edit";


const getRoute = (route: string): string => {
  return APP_BASE_ROUTE + route;
};


export default getRoute;

export {
  APP_BASE_ROUTE,
  LOGIN_ROUTE,
  REGISTER_ROUTE,
  HOME_ROUTE,
  SETTINGS_ROUTE,
  MARKETS_ROUTE,
  MARKETS_ADD_ROUTE,
  MARKETS_DETAILS_ROUTE,
  MARKETS_EDIT_ROUTE
};
