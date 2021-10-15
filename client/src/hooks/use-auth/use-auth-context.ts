import { AuthContextType } from "contexts/auth";
import { useCallback, useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { LocationState } from "types/location";

export function useAuthContext(): AuthContextType {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [token, setToken] = useState("");
  let history = useHistory();

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (storedToken) {
      setIsAuthenticated(true);
    }
  }, []);

  const signin = useCallback(
    (username: string, password: string, from: LocationState) => {
      const data = {
        username: "pepe",
        password: "ABCD12345!"
      };
      fetch("/auth/api-token-auth/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
      })
        .then((response) => response.json())
        .then((data) => {
          console.log(data);
          setIsAuthenticated(true);
          setToken(data);
          localStorage.setItem("token", data.token);
          history.replace(from.from.pathname);
        });
      // return result;
    },
    [history]
  );

  const signout = useCallback(() => {
    setToken("");
    setIsAuthenticated(false);
    localStorage.setItem("token", "");
    return null;
  }, []);

  return {
    isAuthenticated,
    token,
    signin,
    signout
  };
}
