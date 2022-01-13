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
      Authorization: `Token ${localStorage.getItem("token")}`,
    };
    return headers;
  }, []);

  const {
    get: apiGet,
    put,
    response,
    loading: isLoading,
    cache,
  } = useFetch(endpoint, {
    headers: getHeaders(),
  });

  const get = useCallback(async () => {
    const responseValues = await apiGet();
    if (response.ok) {
      setSettings(responseValues);
    }
    return response;
  }, [apiGet, response]);

  const update = useCallback(
    async (settingsId: number, newValues: ISettingsFormFields) => {
      const responseValues = await put({
        settingsId,
        newValues,
      });

      if (response.ok) {
        setSettings(responseValues);
        cache.clear();
      }
      return response;
    },
    [put, response, cache],
  );

  useEffect(() => {
    if (cancelRequest.current) return undefined;
    if (authState.isAuthenticated) {
      get();
    }
    return () => {
      cancelRequest.current = true;
    };
  }, [get, authState.isAuthenticated]);
  return {
    isLoading,
    settings,
    get,
    update,
  };
}

export default useSettingsContext;
