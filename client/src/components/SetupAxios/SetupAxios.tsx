/* eslint-disable react-hooks/exhaustive-deps */
import { useContext, useEffect, useState } from "react";
import setupInterceptors from "api/api-interceptors";
import { AuthContext } from "contexts/auth";

function SetupAxios() {
  const { clearToken } = useContext(AuthContext);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (!loaded) {
      setupInterceptors(clearToken);
    }
    setLoaded(true);
  }, [loaded]);

  return null;
}

export default SetupAxios;
