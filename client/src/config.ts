import { IConfig } from "types/config";

const dev: IConfig = {
  SENTRY_ENV: import.meta.env.VITE_SENTRY_ENV,
};

const prod: IConfig = {
  SENTRY_ENV: import.meta.env.VITE_SENTRY_ENV,
};

const test: IConfig = {
  SENTRY_ENV: "",
};

let tempConfig = dev;

if (process.env.NODE_ENV === "production") {
  tempConfig = prod;
}

if (process.env.NODE_ENV === "test") {
  tempConfig = test;
}
const config = tempConfig;

export default config;
