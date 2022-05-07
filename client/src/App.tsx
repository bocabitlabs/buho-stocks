import React, { useCallback, useContext, useEffect, useState } from "react";
import "./App.css";
import { Outlet } from "react-router-dom";
import { toast } from "react-toastify";
import { Layout } from "antd";
import { navLinks } from "components/AppSidebar/AppSidebar";
import NavBar from "components/NavBar/NavBar";
import PageFooter from "components/PageFooter/PageFooter";
import RoutesMenu from "components/RoutesMenu/RoutesMenu";
import SideBar from "components/SideBar/SideBar";
import { AuthContext } from "contexts/auth";
import { useSettings } from "hooks/use-settings/use-settings";
import i18n from "i18n";

function App() {
  const { state } = useContext(AuthContext);
  const { isAuthenticated } = state;

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
    <div className="App">
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
