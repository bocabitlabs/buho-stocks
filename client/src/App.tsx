import React from "react";
import "./App.css";
import { useTranslation } from "react-i18next";
import { useAuthContext } from "hooks/use-auth/use-auth-context";
import { Col, Layout, Menu, Row } from "antd";
import { Content, Footer, Header } from "antd/lib/layout/layout";
import { UserOutlined } from "@ant-design/icons";
import { Redirect, Route, Switch } from "react-router-dom";
import Title from "antd/lib/typography/Title";
import AppSidebar from "components/AppSidebar/AppSidebar";
import HomePage from "pages/HomePage/HomePage";
import SettingsPage from "pages/SettingsPage/SettingsPage";
import ImportExportPage from "pages/ImportExportPage/ImportExportPage";
import SectorsPage from "pages/SectorsPage/SectorsPage";
import CurrenciesPage from "pages/CurrenciesPage/CurrenciesPage";
import MarketsPage from "pages/MarketsPage/MarketsPage";
import PortfoliosPage from "pages/PortfoliosPage/PortfoliosPage";
import getRoute, { APP_BASE_ROUTE, HOME_ROUTE, SETTINGS_ROUTE } from "routes";
import SubMenu from "antd/lib/menu/SubMenu";
import MarketsAddPage from "pages/MarketsAddPage/MarketsAddPage";
import MarketsEditPage from "pages/MarketsEditPage/MarketsEditPage";

function App() {
  const { t } = useTranslation();
  const auth = useAuthContext();

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
          backgroundColor: "#fff",
          padding: "0 20px"
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
            <Menu theme="light" mode="horizontal" defaultSelectedKeys={["1"]}>
              <SubMenu
                style={{ position: "absolute", top: 0, right: 0 }}
                key="sub1"
                icon={<UserOutlined />}
              >
                <Menu.Item key="3" onClick={signout}>
                  {t("Sign out")}
                </Menu.Item>
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
            <Switch>
              <Route exact path={getRoute(APP_BASE_ROUTE)}>
                <Redirect to={getRoute(HOME_ROUTE)} />
              </Route>
              <Route exact path={getRoute(HOME_ROUTE)} component={HomePage} />
              <Route exact path="/app/portfolios" component={PortfoliosPage} />
              <Route exact path="/app/markets/add" component={MarketsAddPage} />
              <Route
                exact
                path="/app/markets/:id"
                component={MarketsEditPage}
              />
              <Route exact path="/app/markets" component={MarketsPage} />
              <Route exact path="/app/currencies" component={CurrenciesPage} />
              <Route exact path="/app/sectors" component={SectorsPage} />
              <Route
                exact
                path="/app/import-export"
                component={ImportExportPage}
              />
              <Route
                exact
                path={getRoute(SETTINGS_ROUTE)}
                component={SettingsPage}
              />
            </Switch>
          </Content>
        </Col>
      </Row>
      <Footer style={{ textAlign: "center" }}>Bocabitlabs ©2021</Footer>
    </Layout>
  );
}

export default App;
