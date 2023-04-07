/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import setupInterceptors from "api/api-interceptors";

function SetupAxios() {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (!loaded) {
      setupInterceptors();
    }
    setLoaded(true);
  }, [loaded]);

  return null;
}

export default SetupAxios;
