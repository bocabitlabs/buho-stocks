import App from "App";
import { AuthContext } from "contexts/auth";
import { LoginPage } from "pages/LoginPage/LoginPage";
import { PrivateRoute } from "pages/PrivateRoute/PrivateRoute";
import Register from "pages/RegisterPage/RegisterPage";
import React, { ReactElement, useContext } from "react";
import { Route, BrowserRouter as Router, Switch } from "react-router-dom";
import getRoute, { LOGIN_ROUTE, REGISTER_ROUTE } from "routes";

export default function Main(): ReactElement {
  const authContext = useContext(AuthContext);

  return (
    <AuthContext.Provider value={authContext}>
      <Router>
        <Switch>
          <Route path={getRoute(LOGIN_ROUTE)}>
            <LoginPage />
          </Route>
          <Route path={getRoute(REGISTER_ROUTE)}>
            <Register />
          </Route>
          <PrivateRoute path={getRoute("")}>
            <App />
          </PrivateRoute>
        </Switch>
      </Router>
    </AuthContext.Provider>
  );
}
