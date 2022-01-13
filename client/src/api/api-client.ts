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

// export interface IApiResponse {
//   error: boolean;
//   result: any;
//   statusCode: number;
// }

export interface IApiResponse {
  [key: string]: string;
}
