import { useCallback, useReducer, useState } from "react";
import { AuthContextType } from "contexts/auth";

interface MyState {
  isAuthenticated: boolean;
  token: any;
}

export function useAuthContext(): AuthContextType {
  const [isWorking, setIsWorking] = useState(false);
  const [state, setState] = useReducer(
    // eslint-disable-next-line @typescript-eslint/no-shadow
    (state: MyState, newState: Partial<MyState>) => {
      return { ...state, ...newState };
    },
    {
      isAuthenticated: !!localStorage.getItem("token"),
      token: localStorage.getItem("token")
    }
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

  const prueba = useCallback(() => {
    console.debug("useAuth: Calling prueba");
    setState({ isAuthenticated: false, token: null });
  }, []);

  const updateIsWorking = useCallback(() => {
    console.debug("useAuth: Calling updateIsWorking");
    setIsWorking(true);
  }, []);

  return {
    state,
    isWorking,
    authenticate,
    clearToken,
    prueba,
    updateIsWorking
  };
}

export default useAuthContext;
