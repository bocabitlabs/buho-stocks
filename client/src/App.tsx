import React, { useContext } from "react";
import { QueryClient, QueryClientProvider } from "react-query";
import { Outlet } from "react-router-dom";
import "./App.css";
import { Avatar, Layout, Typography } from "antd";
import { Content, Header } from "antd/lib/layout/layout";
import { Provider } from "use-http";
import AlertMessages from "components/AlertMessages/AlertMessages";
import AppSidebar from "components/AppSidebar/AppSidebar";
import PageFooter from "components/PageFooter/PageFooter";
import { AlertMessagesContext } from "contexts/alert-messages";
import LanguageLoader from "LanguageLoader";

const queryClient = new QueryClient();

function App() {
  const { createError } = useContext(AlertMessagesContext);

  return (
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
      <QueryClientProvider client={queryClient}>
        <Layout>
          <LanguageLoader />
          <AppSidebar />
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
              <Typography.Title style={{ fontSize: 30, lineHeight: "inherit" }}>
                <Avatar src="/icons/android-icon-72x72.png" />
                Buho Stocks
              </Typography.Title>
            </Header>
            <Content className="site-layout" style={{ margin: "24px 16px 0" }}>
              <AlertMessages />
              <div
                className="site-layout-background"
                style={{ minHeight: 380 }}
              >
                <Outlet />
              </div>
            </Content>
            <PageFooter />
          </div>
        </Layout>
      </QueryClientProvider>
    </Provider>
  );
}

export default App;
