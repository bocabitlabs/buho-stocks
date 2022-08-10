import { apiClient, getAxiosHeadersWithAuth } from "./api-client";

const setupInterceptors = (clearToken: any) => {
  apiClient.interceptors.request.use(
    (config) => {
      // Do something before request is sent
      const newConfig = config;
      newConfig.headers = getAxiosHeadersWithAuth();
      return newConfig;
    },
    (error) => {
      // Do something with request error
      return Promise.reject(error);
    },
  );

  apiClient.interceptors.response.use(
    (response) => {
      return response;
    },
    (error) => {
      if (error.response.status === 401) {
        console.error("You need to login again");
        clearToken();
      }
      return Promise.reject(error);
    },
  );
};

export default setupInterceptors;
