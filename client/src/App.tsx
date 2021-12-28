import React from "react";
import { Outlet } from "react-router-dom";
import "./App.css";
import { UserOutlined } from "@ant-design/icons";
import { Col, Layout, Menu, Row } from "antd";
import { Content, Footer, Header } from "antd/lib/layout/layout";
import SubMenu from "antd/lib/menu/SubMenu";
import Title from "antd/lib/typography/Title";
import { Provider } from "use-http";
import Breadcrumbs from "breadcrumbs";
import AlertMessages from "components/AlertMessages/AlertMessages";
import AppSidebar from "components/AppSidebar/AppSidebar";
import LogoutButton from "components/LogoutButton/LogoutButton";
import { AlertMessagesContext } from "contexts/alert-messages";
import { SettingsContext } from "contexts/settings";
import { useAlertMessagesContext } from "hooks/use-alert-messages/use-alert-messages-context";
import { useSettingsContext } from "hooks/use-settings/use-settings-context";
import SettingsLoader from "SettingsLoader";

function App() {
  const settingsContext = useSettingsContext();
  const messagesContext = useAlertMessagesContext();

  return (
    <SettingsContext.Provider value={settingsContext}>
      <Provider
        url="/api/v1/"
        options={{
          headers: {
            Accept: "application/json",
            Authorization: `Token ${localStorage.getItem("token")}`,
          },
        }}
      >
        <SettingsLoader>
          <Layout>
            <Header
              style={{
                position: "fixed",
                zIndex: 1,
                width: "100%",
                backgroundColor: "#fff",
                padding: "0 20px",
              }}
            >
              <Row justify="space-between">
                <Col span={10}>
                  <span style={{ float: "left" }}>
                    <Title style={{ fontSize: 30, lineHeight: "inherit" }}>
                      Buho Stocks
                    </Title>
                  </span>
                </Col>
                <Col span={2} offset={10} style={{ textAlign: "right" }}>
                  <Menu
                    theme="light"
                    mode="horizontal"
                    defaultSelectedKeys={["1"]}
                  >
                    <SubMenu
                      style={{ position: "absolute", top: 0, right: 0 }}
                      key="sub1"
                      icon={<UserOutlined />}
                    >
                      <LogoutButton />
                    </SubMenu>
                  </Menu>
                </Col>
              </Row>
            </Header>
            <Row style={{ marginTop: 64 }} justify="space-around">
              <Col span={6}>
                <AppSidebar />
              </Col>

              <Col span={17}>
                <Content className="site-layout">
                  <Breadcrumbs />
                  <AlertMessagesContext.Provider value={messagesContext}>
                    <AlertMessages />
                    <div
                      className="site-layout-background"
                      style={{ minHeight: 380 }}
                    >
                      <Outlet />
                    </div>
                  </AlertMessagesContext.Provider>
                </Content>
              </Col>
            </Row>
            <Footer style={{ textAlign: "center" }}>Bocabitlabs ©2021</Footer>
          </Layout>
        </SettingsLoader>
      </Provider>
    </SettingsContext.Provider>
  );
}

export default App;
