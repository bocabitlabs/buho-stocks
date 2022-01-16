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

export const axiosOptionsWithAuth = {
  headers: {
    Accept: "application/json",
    Authorization: `Token ${localStorage.getItem("token")}`,
  },
};
