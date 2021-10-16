import App from "App";
import { AuthContext } from "contexts/auth";
import { LoginPage } from "pages/Login/Login";
import { PrivateRoute } from "pages/PrivateRoute/PrivateRoute";
import Register from "pages/Register/Register";
import React, { ReactElement, useContext } from "react";
import { Route, BrowserRouter as Router, Switch } from "react-router-dom";


export default function Main(): ReactElement {
  const authContext = useContext(AuthContext);

  return (
    <AuthContext.Provider value={authContext}>
      <Router>
        <Switch>
          <Route path="/login">
            <LoginPage />
          </Route>
          <Route path="/register">
            <Register />
          </Route>
          <PrivateRoute path="/app">
            <App />
          </PrivateRoute>
        </Switch>
      </Router>
    </AuthContext.Provider>
  );
}
