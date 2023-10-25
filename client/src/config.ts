import { IConfig } from "types/config";

const dev: IConfig = {
  ENABLE_SENTRY: false,
  SENTRY_DSN: import.meta.env.VITE_SENTRY_DSN,
  SENTRY_ENV: import.meta.env.VITE_SENTRY_ENV,
  WEBSOCKETS_URL: import.meta.env.VITE_WEBSOCKETS_URL,
};

const prod: IConfig = {
  ENABLE_SENTRY: true,
  SENTRY_DSN: import.meta.env.VITE_SENTRY_DSN,
  SENTRY_ENV: import.meta.env.VITE_SENTRY_ENV,
  WEBSOCKETS_URL: import.meta.env.VITE_WEBSOCKETS_URL,
};

const test: IConfig = {
  ENABLE_SENTRY: false,
  SENTRY_DSN: "",
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
