import React, { useContext } from "react";
// import { Outlet } from "react-router-dom";
import "./App.css";
import { Outlet } from "react-router-dom";
import {
  Avatar,
  // Avatar,
  Layout,
  Typography,
  //  Typography
} from "antd";
// import { Content, Header } from "antd/lib/layout/layout";
// import AlertMessages from "components/AlertMessages/AlertMessages";
// import AppSidebar from "components/AppSidebar/AppSidebar";
// import PageFooter from "components/PageFooter/PageFooter";
import { Content, Header } from "antd/lib/layout/layout";
import AlertMessages from "components/AlertMessages/AlertMessages";
import PageFooter from "components/PageFooter/PageFooter";
import { AuthContext } from "contexts/auth";
import LanguageLoader from "LanguageLoader";

function App() {
  const { state } = useContext(AuthContext);
  const { isAuthenticated } = state;

  if (!isAuthenticated) {
    return <div>Login in...</div>;
  }

  return (
    <Layout>
      <LanguageLoader />
      {/* <AppSidebar /> */}
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
          <div className="site-layout-background" style={{ minHeight: 380 }}>
            <Outlet />
          </div>
        </Content>
        <PageFooter />
      </div>
    </Layout>
  );
}

export default App;
