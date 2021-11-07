import React, { FC } from "react";

import { Spin } from "antd";
import { useAuthContext } from "hooks/use-auth/use-auth-context";
import { Redirect, Route, RouteProps } from "react-router-dom";

// screen if you're not yet authenticated.
export const PrivateRoute: FC<RouteProps> = ({ children, ...rest }) => {
  const { isLoading, isAuthenticated } = useAuthContext();

  if (isLoading) {
    return <Spin />;
  }
  return (
    <Route
      // eslint-disable-next-line react/jsx-props-no-spreading
      {...rest}
      render={({ location }) =>
        isAuthenticated ? (
          children
        ) : (
          <Redirect
            to={{
              pathname: "/app/login",
              state: { from: location }
            }}
          />
        )
      }
    />
  );
};

export default PrivateRoute;
