import React, { useEffect, useState } from "react";
import logo from "./logo.svg";
import "./App.css";
import { useTranslation } from "react-i18next";
import { useAuthContext } from "hooks/use-auth/use-auth-context";
import { Avatar, Breadcrumb, Col, Layout, Menu, Row } from "antd";
import { Content, Footer, Header } from "antd/lib/layout/layout";
import {
  AppstoreOutlined,
  HomeOutlined,
  MailOutlined,
  SettingOutlined,
  UserOutlined
} from "@ant-design/icons";
import { Link } from "react-router-dom";
import SubMenu from "antd/lib/menu/SubMenu";
import Title from "antd/lib/typography/Title";

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
          <Col span={8}>
            <span style={{float: "left"}}><Title style={{fontSize: 30, lineHeight: "inherit"}}>Buho Stocks</Title></span>
            <Menu theme="light" mode="horizontal" defaultSelectedKeys={["1"]}>
              <Link to={"/app"}>
                <Menu.Item key="1" icon={<HomeOutlined />}>
                  Home
                </Menu.Item>
              </Link>
            </Menu>
          </Col>
          <Col span={8} offset={8} style={{ textAlign: "right" }}>
            <Link to={"/profile"}>
              <Avatar style={{ backgroundColor: 'rgb(50 152 254)' }} icon={<UserOutlined />} />
            </Link>
          </Col>
        </Row>
      </Header>
      <Row style={{ padding: "0 20px", marginTop: 64 }}>
        <Col span={6}>
          <Menu mode="inline" style={{ width: 256, marginTop: 20 }}>
            <Menu.Item key="1">Portfolios</Menu.Item>
            <Menu.Item key="2">Markets</Menu.Item>
            <Menu.Item key="3">Currencies</Menu.Item>
            <Menu.Item key="4">Sectors</Menu.Item>
            <Menu.Item key="4">Import & Export</Menu.Item>
            <Menu.Item key="4">Settings</Menu.Item>
          </Menu>
        </Col>
        <Col span={18}>
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
