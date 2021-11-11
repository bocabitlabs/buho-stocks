import React, { ReactElement } from "react";
import {
  BrowserRouter as Router,
  Redirect,
  Route,
  Switch
} from "react-router-dom";
import App from "App";
import { AuthContext } from "contexts/auth";
import { useAuthContext } from "hooks/use-auth/use-auth-context";
import { LoginPage } from "pages/LoginPage/LoginPage";
import PrivateRoute from "pages/PrivateRoute/PrivateRoute";
import RegisterPage from "pages/RegisterPage/RegisterPage";
import getRoute, { HOME_ROUTE, LOGIN_ROUTE, REGISTER_ROUTE } from "routes";

export default function Main(): ReactElement {
  const authContext = useAuthContext();
  return (
    <Router>
      <AuthContext.Provider value={authContext}>
        <Switch>
          <Route path={getRoute(LOGIN_ROUTE)} component={LoginPage} />
          <Route path={getRoute(REGISTER_ROUTE)} component={RegisterPage} />
          <Route exact path="/">
            <Redirect to={getRoute(HOME_ROUTE)} />
          </Route>
          <PrivateRoute path={getRoute("")} component={App} />
        </Switch>
      </AuthContext.Provider>
    </Router>
  );
}
