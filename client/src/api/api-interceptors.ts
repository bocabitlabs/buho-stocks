import { apiClient, getAxiosHeadersWithAuth } from "./api-client";

const setupInterceptors = () => {
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
};

export default setupInterceptors;
