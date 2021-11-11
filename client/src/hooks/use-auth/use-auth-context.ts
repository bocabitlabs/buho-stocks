import { useCallback, useEffect, useReducer, useState } from "react";
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
      console.log("useReducer newState: ", newState);
      return { ...state, ...newState };
    },
    {
      isAuthenticated: !!localStorage.getItem("token"),
      token: localStorage.getItem("token")
    }
  );

  useEffect(() => {
    console.debug("useAuth useEffect state:", state);
  }, [state]);

  const authenticate = useCallback(
    (newToken: string) => {
      // if (!state.isAuthenticated) {
      console.debug("useAuth: Calling authenticate");
      localStorage.setItem("token", newToken);

      // const storedToken = localStorage.getItem("token");
      console.log("useAuth authenticate previous state: ", state);
      console.log("useAuth authenticate new token:", newToken);
      // console.log(
      //   "useAuth new state: ",
      //   JSON.stringify({ isAuthenticated: true, token: storedToken })
      // );
      setState({ isAuthenticated: true, token: newToken });
      // }
    },
    [state]
  );

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
