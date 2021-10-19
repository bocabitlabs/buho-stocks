// A wrapper for <Route> that redirects to the login

import { useAuthContext } from "hooks/use-auth/use-auth-context";
import { FC } from "react";
import { Redirect, Route, RouteProps } from "react-router-dom";


// screen if you're not yet authenticated.
export const PrivateRoute: FC<RouteProps> = ({ children, ...rest }) => {
  let auth = useAuthContext();
  return (
    <Route
      {...rest}
      render={({ location }) =>
        auth.isAuthenticated ? (
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
