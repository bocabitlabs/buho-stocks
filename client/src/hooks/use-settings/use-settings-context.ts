import { useCallback, useContext, useEffect, useRef, useState } from "react";
import useFetch from "use-http";
import { AuthContext } from "contexts/auth";
import { SettingsContextType } from "contexts/settings";
import { ISettings, ISettingsFormFields } from "types/settings";

export function useSettingsContext(): SettingsContextType {
  const [settings, setSettings] = useState<ISettings | null>(null);
  const { state: authState } = useContext(AuthContext);
  const cancelRequest = useRef<boolean>(false);
  const endpoint = "/api/v1/settings/";
  const getHeaders = useCallback(() => {
    const headers = {
      Accept: "application/json",
      Authorization: `Token ${localStorage.getItem("token")}`
    };
    return headers;
  }, []);

  const {
    get: apiGet,
    put,
    response,
    error,
    loading: isLoading,
    cache
  } = useFetch(endpoint, {
    headers: getHeaders()
  });

  const get = useCallback(async () => {
    const responseValues = await apiGet();
    if (response.ok) {
      setSettings(responseValues);
    } else {
      console.error(error);
    }
    return response;
  }, [apiGet, response, error]);

  const update = useCallback(
    async (settingsId: number, newValues: ISettingsFormFields) => {
      const responseValues = await put({
        settingsId,
        newValues
      });

      if (response.ok) {
        setSettings(responseValues);
        cache.clear();
      } else {
        console.error(error);
      }
      return response;
    },
    [put, response, error, cache]
  );

  useEffect(() => {
    if (cancelRequest.current) return undefined;
    if (authState.isAuthenticated) {
      get();
      console.log("user is authenticated. Will get settings");
    } else {
      console.log("User is not logged in. Not getting settings");
    }
    return () => {
      cancelRequest.current = true;
    };
  }, [get, authState.isAuthenticated]);
  return {
    isLoading,
    settings,
    get,
    update
  };
}

export default useSettingsContext;
