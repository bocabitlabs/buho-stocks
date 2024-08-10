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

// URL must be set in .env file or if it is empty, get the current URL base
const url = import.meta.env.VITE_API_URL || window.location.origin;

const apiClient = axios.create({
  baseURL: url,
});

export { apiClient, getAxiosOptionsWithAuth };
