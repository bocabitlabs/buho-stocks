import React, { useEffect, useState } from "react";
import "./App.css";
import { useTranslation } from "react-i18next";
import { useAuthContext } from "hooks/use-auth/use-auth-context";
import { Avatar, Breadcrumb, Col, Layout, Row } from "antd";
import { Content, Footer, Header } from "antd/lib/layout/layout";
import {
  UserOutlined
} from "@ant-design/icons";
import { Link } from "react-router-dom";
import SubMenu from "antd/lib/menu/SubMenu";
import Title from "antd/lib/typography/Title";
import AppSidebar from "components/AppSidebar/AppSidebar";

function App() {
  const [markets] = useState("");

  const { i18n } = useTranslation();
  const auth = useAuthContext();

  useEffect(() => {
    // const settings = SettingsService.getSettings()
    // i18n.changeLanguage(settings.language);
  }, [i18n]);

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
    <Layout>
      <Header
        style={{
          position: "fixed",
          zIndex: 1,
          width: "100%",
          backgroundColor: "#fff"
        }}
      >
        <Row justify="space-between">
          <Col span={20}>
            <span style={{ float: "left" }}>
              <Title style={{ fontSize: 30, lineHeight: "inherit" }}>
                Buho Stocks
              </Title>
            </span>
            {/* <Menu theme="light" mode="horizontal" defaultSelectedKeys={["1"]}>
              <Link to={"/app"}>
                <Menu.Item key="1" icon={<HomeOutlined />}>
                  Home
                </Menu.Item>
              </Link>
            </Menu> */}
          </Col>
          <Col span={4} style={{ textAlign: "right" }}>
            <Link to={"/profile"}>
              <Avatar
                style={{ backgroundColor: "rgb(50 152 254)" }}
                icon={<UserOutlined />}
              />
            </Link>
          </Col>
        </Row>
      </Header>
      <Row style={{ marginTop: 64 }} justify="space-around">
        <Col span={6}>
          <AppSidebar/>
        </Col>
        <Col span={17}>
          <Content className="site-layout">
            <Breadcrumb style={{ margin: "16px 0" }}>
              <Breadcrumb.Item>Home</Breadcrumb.Item>
              <Breadcrumb.Item>List</Breadcrumb.Item>
              <Breadcrumb.Item>App</Breadcrumb.Item>
            </Breadcrumb>
            <div
              className="site-layout-background"
              style={{ padding: 24, minHeight: 380 }}
            >
              Content
            </div>
          </Content>
        </Col>
      </Row>
      <Footer style={{ textAlign: "center" }}>
        Ant Design ©2018 Created by Ant UED
      </Footer>
    </Layout>
    // <div className="App">
    //   <header className="App-header">
    //     <img src={logo} className="App-logo" alt="logo" />
    //     <button onClick={getMarkets}>Get markets</button>
    //     <button onClick={signout}>Signout</button>

    //     <p>
    //       Edit <code>src/App.tsx</code> and save to reload.
    //       {JSON.stringify(markets)}
    //     </p>
    //     <a
    //       className="App-link"
    //       href="https://reactjs.org"
    //       target="_blank"
    //       rel="noopener noreferrer"
    //     >
    //       Learn React
    //     </a>
    //   </header>
    // </div>
  );
}

export default App;
