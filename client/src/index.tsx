import React from "react";
import { QueryClientProvider } from "react-query";
import { MantineProvider } from "@mantine/core";
import { Chart, registerables } from "chart.js";
import ReactDOM from "react-dom/client";
import "react-toastify/dist/ReactToastify.css";
import "./i18n";
import { ReactQueryDevtools } from "react-query/devtools";
import reportWebVitals from "./reportWebVitals";
import queryClient from "api/query-client";
import Main from "MainRouter";
import "@mantine/core/styles.css";
import "@mantine/dropzone/styles.css";

Chart.register(...registerables);

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement,
);

root.render(
  <React.StrictMode>
    <MantineProvider>
      <QueryClientProvider client={queryClient}>
        <Main />
        <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>
    </MantineProvider>
  </React.StrictMode>,
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
