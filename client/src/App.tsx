import React, { useEffect, useState } from "react";
import "./index.css";
import "./App.css";
import { useTranslation } from "react-i18next";
import { ToastContainer, toast } from "react-toastify";
import { ConfigProvider, theme } from "antd";
import AppLayout from "AppLayout";
import { useSettings } from "hooks/use-settings/use-settings";
import i18n from "i18n";

function useDarkMode() {
  return (
    window.matchMedia &&
    window.matchMedia("(prefers-color-scheme:dark)").matches
  );
}

function App() {
  const { t } = useTranslation();
  const [isDarkMode, setIsDarkMode] = useState(useDarkMode());
  const changeTheme = () => {
    setIsDarkMode((previousValue) => !previousValue);
  };

  const { data, error: errorSettings } = useSettings({
    onError: () => {
      toast.error<string>(t("Unable to load settings"));
    },
  });

  useEffect(() => {
    if (data) {
      i18n.changeLanguage(data?.language);
    }
  }, [data]);

  return (
    <ConfigProvider
      theme={{
        algorithm: isDarkMode ? theme.darkAlgorithm : theme.defaultAlgorithm,
      }}
    >
      {errorSettings ? (
        <div>Unable to fetch application&apos;s settings.</div>
      ) : (
        <div className="App">
          <AppLayout changeTheme={changeTheme} />
          <ToastContainer position="top-center" theme="colored" newestOnTop />
        </div>
      )}
    </ConfigProvider>
  );
}

export default App;
