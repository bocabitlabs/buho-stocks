import React from "react";
import ReactDOM from "react-dom";
import { Chart, registerables } from "chart.js";
import "react-toastify/dist/ReactToastify.css";
import "./index.css";
import "./i18n";
import reportWebVitals from "./reportWebVitals";
import Main from "Main";

Chart.register(...registerables);

ReactDOM.render(
  <React.StrictMode>
    <Main />
  </React.StrictMode>,
  document.getElementById("root"),
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
