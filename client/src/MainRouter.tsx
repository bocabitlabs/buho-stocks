import App from "App";
import { useSettingsContext } from "hooks/use-settings/use-settings-context";
import { LoginPage } from "pages/LoginPage/LoginPage";
import { PrivateRoute } from "pages/PrivateRoute/PrivateRoute";
import Register from "pages/RegisterPage/RegisterPage";
import React, { ReactElement, useEffect } from "react";
import { useTranslation } from "react-i18next";
import {
  Route,
  BrowserRouter as Router,
  Switch,
  Redirect
} from "react-router-dom";
import getRoute, { HOME_ROUTE, LOGIN_ROUTE, REGISTER_ROUTE } from "routes";

export default function Main(): ReactElement {
  const { i18n } = useTranslation();
  const { settings } = useSettingsContext();

  useEffect(() => {
    i18n.changeLanguage(settings?.language);
  }, [i18n, settings]);

  return (
    <Router>
      <Switch>
        <Route exact path={"/"}>
          <Redirect to={getRoute(HOME_ROUTE)} />
        </Route>
        <Route path={getRoute(LOGIN_ROUTE)}>
          <LoginPage />
        </Route>
        <Route path={getRoute(REGISTER_ROUTE)}>
          <Register />
        </Route>
        <PrivateRoute path={getRoute("")} component={App} />
      </Switch>
    </Router>
  );
}
