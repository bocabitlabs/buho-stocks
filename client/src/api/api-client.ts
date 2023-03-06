import axios from "axios";

export interface HttpRequestHeader {
  [key: string]: string;
}

export interface IRegistrationData {
  username: string;
  password: string;
  password2: string;
  firstName: string;
  lastName: string;
  email: string;
}

export interface ILoginData {
  username: string;
  password: string;
}

export interface IApiResponse {
  [key: string]: string;
}

const getAxiosOptionsWithAuth = () => ({
  headers: {
    Accept: "application/json",
  },
});

export const getAxiosHeadersWithAuth = () => ({
  Accept: "application/json",
});

const apiClient = axios.create({
  baseURL: `/api/v1/`,
});

export { apiClient, getAxiosOptionsWithAuth };
