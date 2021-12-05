import React from "react";
import { useTranslation } from "react-i18next";
import { Redirect, Route, Switch } from "react-router-dom";
import "./App.css";
import { UserOutlined } from "@ant-design/icons";
import { Col, Layout, Menu, Row } from "antd";
import { Content, Footer, Header } from "antd/lib/layout/layout";
import SubMenu from "antd/lib/menu/SubMenu";
import Title from "antd/lib/typography/Title";
import AppSidebar from "components/AppSidebar/AppSidebar";
import { SettingsContext } from "contexts/settings";
import { useLoginActions } from "hooks/use-login-actions/use-login-actions";
import { useSettingsContext } from "hooks/use-settings/use-settings-context";
import CompaniesAddPage from "pages/CompaniesAddPage/CompaniesAddPage";
import CompanyDetailsPage from "pages/CompanyDetailsPage/CompanyDetailsPage";
import CurrenciesAddPage from "pages/CurrenciesAddPage/CurrenciesAddPage";
import CurrenciesPage from "pages/CurrenciesPage/CurrenciesPage";
import DividendsTransactionsAddPage from "pages/DividendsTransactionsAddPage/DividendsTransactionsAddPage";
import DividendsTransactionsEditPage from "pages/DividendsTransactionsEditPage/DividendsTransactionsEditPage";
import HomePage from "pages/HomePage/HomePage";
import ImportExportPage from "pages/ImportExportPage/ImportExportPage";
import MarketsAddPage from "pages/MarketsAddPage/MarketsAddPage";
import MarketsEditPage from "pages/MarketsEditPage/MarketsEditPage";
import MarketsPage from "pages/MarketsPage/MarketsPage";
import PortfolioDetailsPage from "pages/PortfolioDetailPage/PortfolioDetailsPage";
import PortfoliosAddPage from "pages/PortfoliosAddPage/PortfoliosAddPage";
import PortfoliosPage from "pages/PortfoliosPage/PortfoliosPage";
import PrivateRoute from "pages/PrivateRoute/PrivateRoute";
import RightsTransactionsAddPage from "pages/RightsTransactionsAddPage/RightsTransactionsAddPage";
import RightsTransactionsEditPage from "pages/RightsTransactionsEditPage/RightsTransactionsEditPage";
import SectorsAddPage from "pages/SectorsAddPage/SectorsAddpage";
import SectorsEditPage from "pages/SectorsEditPage/SectorsEditPage";
import SectorsPage from "pages/SectorsPage/SectorsPage";
import SettingsPage from "pages/SettingsPage/SettingsPage";
import SharesTransactionsAddPage from "pages/SharesTransactionsAddPage/SharesTransactionsAddPage";
import SharesTransactionsEditPage from "pages/SharesTransactionsEditPage/SharesTransactionsEditPage";
import getRoute, {
  APP_BASE_ROUTE,
  COMPANIES_ADD_ROUTE,
  COMPANIES_DETAILS_ROUTE,
  CURRENCIES_ADD_ROUTE,
  CURRENCIES_ROUTE,
  DIVIDENDS_ADD_ROUTE,
  DIVIDENDS_EDIT_ROUTE,
  HOME_ROUTE,
  MARKETS_ADD_ROUTE,
  MARKETS_ROUTE,
  PORTFOLIOS_ADD_ROUTE,
  PORTFOLIOS_DETAILS_ROUTE,
  PORTFOLIOS_ROUTE,
  RIGHTS_ADD_ROUTE,
  RIGHTS_EDIT_ROUTE,
  SECTORS_ADD_ROUTE,
  SECTORS_ROUTE,
  SETTINGS_ROUTE,
  SHARES_ADD_ROUTE,
  SHARES_EDIT_ROUTE
} from "routes";
import SettingsLoader from "SettingsLoader";

function App() {
  const { t } = useTranslation();
  const loginActions = useLoginActions();
  const settingsContext = useSettingsContext();

  const signout = () => {
    loginActions.signout();
  };

  console.log("Loading App component");
  return (
    <SettingsContext.Provider value={settingsContext}>
      <SettingsLoader>
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
                  <PrivateRoute
                    exact
                    path={APP_BASE_ROUTE}
                    component={() => <Redirect to={getRoute(HOME_ROUTE)} />}
                  />
                  <PrivateRoute
                    exact
                    path={getRoute(COMPANIES_ADD_ROUTE)}
                    component={CompaniesAddPage}
                  />
                  <PrivateRoute
                    exact
                    path={getRoute(COMPANIES_DETAILS_ROUTE)}
                    component={CompanyDetailsPage}
                  />
                  <PrivateRoute
                    exact
                    path={`${getRoute(DIVIDENDS_ADD_ROUTE)}`}
                    component={DividendsTransactionsAddPage}
                  />
                  <PrivateRoute
                    exact
                    path={`${getRoute(DIVIDENDS_EDIT_ROUTE)}`}
                    component={DividendsTransactionsEditPage}
                  />
                  <PrivateRoute
                    exact
                    path={`${getRoute(RIGHTS_ADD_ROUTE)}`}
                    component={RightsTransactionsAddPage}
                  />
                  <PrivateRoute
                    exact
                    path={`${getRoute(RIGHTS_EDIT_ROUTE)}`}
                    component={RightsTransactionsEditPage}
                  />
                  <PrivateRoute
                    exact
                    path={`${getRoute(SHARES_ADD_ROUTE)}`}
                    component={SharesTransactionsAddPage}
                  />
                  <PrivateRoute
                    exact
                    path={`${getRoute(SHARES_EDIT_ROUTE)}`}
                    component={SharesTransactionsEditPage}
                  />
                  <PrivateRoute
                    exact
                    path={getRoute(CURRENCIES_ADD_ROUTE)}
                    component={CurrenciesAddPage}
                  />
                  <PrivateRoute
                    exact
                    path={getRoute(CURRENCIES_ROUTE)}
                    component={CurrenciesPage}
                  />
                  <PrivateRoute
                    exact
                    path={getRoute(HOME_ROUTE)}
                    component={HomePage}
                  >
                    <HomePage />
                  </PrivateRoute>
                  <PrivateRoute
                    exact
                    path={getRoute(MARKETS_ADD_ROUTE)}
                    component={MarketsAddPage}
                  />
                  <PrivateRoute
                    exact
                    path="/app/markets/:id"
                    component={MarketsEditPage}
                  />
                  <PrivateRoute
                    exact
                    path={getRoute(MARKETS_ROUTE)}
                    component={MarketsPage}
                  />
                  <PrivateRoute
                    exact
                    path={getRoute(PORTFOLIOS_ADD_ROUTE)}
                    component={PortfoliosAddPage}
                  />
                  <PrivateRoute
                    exact
                    path={getRoute(PORTFOLIOS_DETAILS_ROUTE)}
                    component={PortfolioDetailsPage}
                  />
                  <PrivateRoute
                    exact
                    path={getRoute(PORTFOLIOS_ROUTE)}
                    component={PortfoliosPage}
                  />
                  <PrivateRoute
                    exact
                    path={getRoute(SECTORS_ADD_ROUTE)}
                    component={SectorsAddPage}
                  />
                  <PrivateRoute
                    exact
                    path="/app/sectors/:id"
                    component={SectorsEditPage}
                  />
                  <PrivateRoute
                    exact
                    path={getRoute(SECTORS_ROUTE)}
                    component={SectorsPage}
                  />
                  <PrivateRoute
                    exact
                    path="/app/import-export"
                    component={ImportExportPage}
                  />
                  <PrivateRoute
                    exact
                    path={getRoute(SETTINGS_ROUTE)}
                    component={SettingsPage}
                  />
                  <Route render={() => <div>This page does not exist</div>} />
                </Switch>
              </Content>
            </Col>
          </Row>
          <Footer style={{ textAlign: "center" }}>Bocabitlabs ©2021</Footer>
        </Layout>
      </SettingsLoader>
    </SettingsContext.Provider>
  );
}

export default App;
