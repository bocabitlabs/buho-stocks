import { AuthContextType } from "contexts/auth";
import { useCallback, useEffect, useState } from "react";
import { useHistory } from "react-router-dom";

export function useAuthContext(): AuthContextType {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [token, setToken] = useState("");
  let history = useHistory();

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (storedToken) {
      setIsAuthenticated(true);
      history.replace("/app");
    }
    console.log(storedToken)
  }, [history]);

  const signin = useCallback(
    (username: string, password: string) => {
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
          history.replace("/app");
        });
      // return result;
    },
    [history]
  );

  const signout = useCallback(() => {
    setToken("");
    setIsAuthenticated(false);
    localStorage.setItem("token", "");
    history.replace("/login");
    return null;
  }, [history]);

  return {
    isAuthenticated,
    token,
    signin,
    signout
  };
}
