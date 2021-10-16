import React, { useEffect, useState } from "react";
import logo from "./logo.svg";
import "./App.css";
import { useTranslation } from "react-i18next";
import { useAuthContext } from "hooks/use-auth/use-auth-context";

function App() {
  const [markets, ] = useState("");

  const { i18n } = useTranslation();
  const auth = useAuthContext();

  useEffect(() => {
    // const settings = SettingsService.getSettings()
    // i18n.changeLanguage(settings.language);
  }, [i18n])

  const getMarkets = () => {
    const storedToken = localStorage.getItem("token");
    console.log(storedToken);

    fetch("/api/v1/markets/", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Token " + storedToken
        // 'Content-Type': 'application/x-www-form-urlencoded',
      }
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
      });
  };

  const signout = () => {
    auth.signout();
  };

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <button onClick={getMarkets}>Get markets</button>
        <button onClick={signout}>Signout</button>

        <p>
          Edit <code>src/App.tsx</code> and save to reload.
          {JSON.stringify(markets)}
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;
