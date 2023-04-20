import React from "react";
import { QueryClientProvider } from "react-query";
import * as Sentry from "@sentry/react";
import { BrowserTracing } from "@sentry/react";
import { Chart, registerables } from "chart.js";
import ReactDOM from "react-dom/client";
import "react-toastify/dist/ReactToastify.css";
import "./i18n";
import { ReactQueryDevtools } from "react-query/devtools";
import reportWebVitals from "./reportWebVitals";
import queryClient from "api/query-client";
import config from "config";
import Main from "MainRouter";

Chart.register(...registerables);

Sentry.init({
  dsn: config.SENTRY_DSN,
  enabled: config.ENABLE_SENTRY,
  environment: config.SENTRY_ENV,
  integrations: [new BrowserTracing()],

  // Set tracesSampleRate to 1.0 to capture 100%
  // of transactions for performance monitoring.
  // We recommend adjusting this value in production
  tracesSampleRate: 0.5,
});

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement,
);

root.render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <Main />
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  </React.StrictMode>,
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
