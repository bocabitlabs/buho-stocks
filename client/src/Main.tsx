import App from "App";
import { AuthContext } from "contexts/auth";
import { LoginPage } from "pages/Login/Login";
import { PrivateRoute } from "pages/PrivateRoute/PrivateRoute";
import React, { ReactElement, useContext } from "react";
import { Route, BrowserRouter as Router, Switch } from "react-router-dom";

interface Props {}

export default function Main({}: Props): ReactElement {
  const authContext = useContext(AuthContext);

  return (
    <AuthContext.Provider value={authContext}>
      <Router>
        <Switch>
          <Route path="/login">
            <LoginPage />
          </Route>
          <PrivateRoute path="/app">
            <App />
          </PrivateRoute>
        </Switch>
        <App />
      </Router>
    </AuthContext.Provider>
  );
}
