import React, { useContext } from "react";
import { useLocation, Navigate } from "react-router-dom";
import { AuthContext } from "contexts/auth";

function RequireAuth({ children }: { children: JSX.Element }) {
  const { state } = useContext(AuthContext);
  const location = useLocation();

  if (!state.isAuthenticated) {
    // Redirect them to the /login page, but save the current location they were
    // trying to go to when they were redirected. This allows us to send them
    // along to that page after they login, which is a nicer user experience
    // than dropping them off on the home page.
    return <Navigate to="/app-login" state={{ from: location }} />;
  }

  return children;
}

export default RequireAuth;
