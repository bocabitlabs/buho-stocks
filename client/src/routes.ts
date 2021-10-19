const APP_BASE_ROUTE = "/app";
const LOGIN_ROUTE = "/login";
const REGISTER_ROUTE = "/register";

const HOME_ROUTE = "/home";
const SETTINGS_ROUTE = "/settings";

const getRoute = (route: string): string => {
  return APP_BASE_ROUTE + route;
};


export default getRoute;

export {
  APP_BASE_ROUTE,
  LOGIN_ROUTE,
  REGISTER_ROUTE,
  HOME_ROUTE,
  SETTINGS_ROUTE
};
