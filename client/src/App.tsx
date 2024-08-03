import { useEffect } from "react";
import "./index.css";
import "./App.css";
import { useTranslation } from "react-i18next";
import { ToastContainer, toast } from "react-toastify";
import * as Sentry from "@sentry/react";
import AppLayout from "AppLayout";
import config from "config";
import { useSettings } from "hooks/use-settings/use-settings";
import i18n from "i18n";

function App() {
  const { t } = useTranslation();

  const { data, error: errorSettings } = useSettings({
    onError: () => {
      toast.error<string>(t("Unable to load settings"));
    },
  });

  useEffect(() => {
    if (data) {
      i18n.changeLanguage(data?.language);
      // Init Sentry here since the DSN is fetched from the settings
      Sentry.init({
        dsn: data.sentryDsn,
        enabled: data.sentryEnabled,
        environment: config.SENTRY_ENV,

        // Set tracesSampleRate to 1.0 to capture 100%
        // of transactions for performance monitoring.
        // We recommend adjusting this value in production
        tracesSampleRate: 0.5,
      });
    }
  }, [data]);

  if (errorSettings) {
    return <div>Unable to fetch application&apos;s settings.</div>;
  }
  return (
    <div className="App">
      <AppLayout />
      <ToastContainer position="top-center" theme="colored" newestOnTop />
    </div>
  );
}

export default App;
