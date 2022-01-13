import React, { Suspense, useContext } from "react";
import "./App.css";
import { Avatar, Layout, Spin, Typography } from "antd";
import { Content, Header } from "antd/lib/layout/layout";
import { Provider } from "use-http";
import AlertMessages from "components/AlertMessages/AlertMessages";
// import PageFooter from "components/PageFooter/PageFooter";
import PageFooter from "components/PageFooter/PageFooter";
import { AlertMessagesContext } from "contexts/alert-messages";
import { SettingsContext } from "contexts/settings";
import { useSettingsContext } from "hooks/use-settings/use-settings-context";
import Charts from "pages/companies/CompanyDetailsPage/components/Charts/Charts";
import SettingsLoader from "SettingsLoader";

function App() {
  const settingsContext = useSettingsContext();
  const { createError } = useContext(AlertMessagesContext);

  return (
    <SettingsContext.Provider value={settingsContext}>
      <Provider
        url="/api/v1/"
        options={{
          headers: {
            Accept: "application/json",
            Authorization: `Token ${localStorage.getItem("token")}`,
          },
          onError: ({ error }) => {
            createError(`Unable to connect to the API: ${error}`);
          },
        }}
      >
        <SettingsLoader>
          <Layout>
            <div className="site-main-content">
              <Header
                className="site-layout-sub-header-background"
                style={{
                  zIndex: 1,
                  width: "100%",
                  backgroundColor: "#fff",
                  padding: "0 20px",
                  height: 60,
                  display: "block",
                }}
              >
                <Typography.Title
                  style={{ fontSize: 30, lineHeight: "inherit" }}
                >
                  <Avatar src="/icons/android-icon-72x72.png" />
                  Buho Stocks
                </Typography.Title>
              </Header>
              <Content
                className="site-layout"
                style={{ margin: "24px 16px 0" }}
              >
                <AlertMessages />
                <div
                  className="site-layout-background"
                  style={{ minHeight: 380 }}
                >
                  <Suspense fallback={<Spin />}>
                    <Charts stats={[]} />
                  </Suspense>
                </div>
              </Content>
              <PageFooter />
            </div>
          </Layout>
        </SettingsLoader>
      </Provider>
    </SettingsContext.Provider>
  );
}

export default App;
