import React, { useCallback, useContext, useState } from "react";
import "./App.css";
import { Outlet } from "react-router-dom";
import { Layout } from "antd";
import { navLinks } from "components/AppSidebar/AppSidebar";
import NavBar from "components/NavBar/NavBar";
import PageFooter from "components/PageFooter/PageFooter";
import RoutesMenu from "components/RoutesMenu/RoutesMenu";
import SideBar from "components/SideBar/SideBar";
import { AuthContext } from "contexts/auth";
import LanguageLoader from "LanguageLoader";

function App() {
  const { state } = useContext(AuthContext);
  const { isAuthenticated } = state;

  const [selectedKey, setSelectedKey] = useState<string>("0");
  const changeSelectedKey = useCallback((event: any) => {
    const { key } = event;
    setSelectedKey(key);
  }, []);

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
    <div className="App">
      <LanguageLoader />
      <NavBar menu={Menu} />
      <Layout>
        <SideBar menu={Menu} />
        <Layout.Content>
          <Outlet />
          <PageFooter />
        </Layout.Content>
      </Layout>
    </div>
  );
}

export default App;
