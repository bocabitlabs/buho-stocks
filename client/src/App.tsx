import React, { useCallback, useContext, useEffect, useState } from "react";
import "./App.css";
import { ErrorBoundary } from "react-error-boundary";
import { useTranslation } from "react-i18next";
import { QueryErrorResetBoundary } from "react-query";
import { Outlet } from "react-router-dom";
import { toast } from "react-toastify";
import { Button, Layout } from "antd";
import { navLinks } from "components/AppSidebar/AppSidebar";
import LoadingSpin from "components/LoadingSpin/LoadingSpin";
import NavBar from "components/NavBar/NavBar";
import PageFooter from "components/PageFooter/PageFooter";
import RoutesMenu from "components/RoutesMenu/RoutesMenu";
import SideBar from "components/SideBar/SideBar";
import { AuthContext } from "contexts/auth";
import { useSettings } from "hooks/use-settings/use-settings";
import i18n from "i18n";

interface IAppErrorBoundaryProps {
  resetErrorBoundary: (...args: unknown[]) => void;
  error: Error;
}

function ApplicationErrorBoundary({
  resetErrorBoundary,
  error,
}: IAppErrorBoundaryProps): React.ReactElement {
  const { message } = error;
  return (
    <div>
      There was an error!{" "}
      <Button onClick={() => resetErrorBoundary()}>Try again</Button>
      <pre style={{ whiteSpace: "normal" }}>{message}</pre>
    </div>
  );
}

function App() {
  const { state } = useContext(AuthContext);
  const { isAuthenticated } = state;
  const { t } = useTranslation();

  const [selectedKey, setSelectedKey] = useState<string>("0");
  const changeSelectedKey = useCallback((event: any) => {
    const { key } = event;
    setSelectedKey(key);
  }, []);

  const { data, error: errorSettings } = useSettings({
    onError: () => {
      toast.error("Unable to load settings");
    },
  });

  useEffect(() => {
    if (data) {
      i18n.changeLanguage(data?.language);
    }
  }, [data]);

  if (errorSettings) {
    return <div>Unable to fetch application&apos;s settings.</div>;
  }

  if (!isAuthenticated) {
    return <div>Login in...</div>;
  }

  const Menu = (
    <RoutesMenu
      routeLinks={navLinks}
      selectedKey={selectedKey}
      changeSelectedKey={changeSelectedKey}
    />
  );

  return (
    <QueryErrorResetBoundary>
      {({ reset }) => (
        <ErrorBoundary
          fallbackRender={({ error, resetErrorBoundary }) =>
            ApplicationErrorBoundary({ resetErrorBoundary, error })
          }
          onReset={reset}
        >
          <div className="App">
            <NavBar menu={Menu} />
            <Layout>
              <SideBar menu={Menu} />
              <Layout.Content>
                <React.Suspense
                  fallback={
                    <LoadingSpin
                      text={`${t("Loading page...")}`}
                      style={{ marginTop: 20 }}
                    />
                  }
                >
                  <Outlet />
                  <PageFooter />
                </React.Suspense>
              </Layout.Content>
            </Layout>
          </div>
        </ErrorBoundary>
      )}
    </QueryErrorResetBoundary>
  );
}

export default App;
