import { useCallback, useReducer } from "react";
import { AuthContextType } from "contexts/auth";

interface MyState {
  isAuthenticated: boolean;
  token: any;
}

export function useAuthContext(): AuthContextType {
  const [state, setState] = useReducer(
    // eslint-disable-next-line @typescript-eslint/no-shadow
    (state: MyState, newState: Partial<MyState>) => {
      return { ...state, ...newState };
    },
    {
      isAuthenticated: !!localStorage.getItem("token"),
      token: localStorage.getItem("token"),
    },
  );

  const authenticate = useCallback((newToken: string) => {
    console.debug("useAuth: Calling authenticate");
    localStorage.setItem("token", newToken);
    setState({ isAuthenticated: true, token: newToken });
  }, []);

  const clearToken = useCallback(() => {
    if (state.isAuthenticated) {
      console.debug("useAuth: Calling clearToken");
      setState({ isAuthenticated: false, token: null });
    }
  }, [state.isAuthenticated]);

  return {
    state,
    authenticate,
    clearToken,
  };
}

export default useAuthContext;
