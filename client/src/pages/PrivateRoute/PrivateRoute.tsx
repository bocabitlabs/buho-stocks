// import { useAuthContext } from "hooks/use-auth/use-auth-context";
import React from "react";
import { Redirect, Route, RouteProps } from "react-router";
import { useAuthContext } from "hooks/use-auth/use-auth-context";
import getRoute, { LOGIN_ROUTE } from "routes";

export type PrivateRouteProps = {
  component: React.FunctionComponent<any>;
} & RouteProps;

const PrivateRoute = ({ component: Component, ...rest }: PrivateRouteProps) => {
  const { state } = useAuthContext();

  if (state.isAuthenticated) {
    // eslint-disable-next-line react/jsx-props-no-spreading
    return <Route {...rest} component={Component} />;
  }
  return <Redirect to={getRoute(LOGIN_ROUTE)} />;
};

export default PrivateRoute;
