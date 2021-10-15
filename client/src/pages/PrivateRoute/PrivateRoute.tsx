// A wrapper for <Route> that redirects to the login

import { useAuthContext } from "hooks/use-auth/use-auth-context";
import { FC } from "react";
import { Redirect, Route } from "react-router-dom";

interface Props {
  // any props that come into the component
}

// screen if you're not yet authenticated.
export const PrivateRoute: FC<Props> = ({ children, ...rest }) => {
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
              pathname: "/login",
              state: { from: location }
            }}
          />
        )
      }
    />
  );
};
