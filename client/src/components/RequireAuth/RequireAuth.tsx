import { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "contexts/auth";

function RequireAuth({ children }: { children: JSX.Element }) {
  const { state, clearToken } = useContext(AuthContext);
  const navigate = useNavigate();
  console.log(state);

  useEffect(() => {
    if (!state.isAuthenticated) {
      clearToken();
      navigate("/app-login", { replace: true });
    }
  }, [state.isAuthenticated, navigate, clearToken]);

  return children;
}

export default RequireAuth;
