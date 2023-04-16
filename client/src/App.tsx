import React, { useCallback, useEffect, useState } from "react";
import "./index.css";
import "./App.css";
import { useTranslation } from "react-i18next";
import { Outlet } from "react-router-dom";
import { toast } from "react-toastify";
import { ConfigProvider, Layout, theme } from "antd";
import { navLinks } from "components/AppSidebar/AppSidebar";
import PageFooter from "components/PageFooter/PageFooter";
import RoutesMenu from "components/RoutesMenu/RoutesMenu";
import SideBar from "components/SideBar/SideBar";
import TopNavBar from "components/TopNavBar/TopNavBar";
import { useSettings } from "hooks/use-settings/use-settings";
import i18n from "i18n";

function useDarkMode() {
  return (
    window.matchMedia &&
    window.matchMedia("(prefers-color-scheme:dark)").matches
  );
}

function App() {
  const { t } = useTranslation();
  const [isDarkMode, setIsDarkMode] = useState(useDarkMode());

  const handChangeTheme = () => {
    setIsDarkMode((previousValue) => !previousValue);
  };

  const [selectedKey, setSelectedKey] = useState<string>("0");
  const changeSelectedKey = useCallback((event: any) => {
    const { key } = event;
    setSelectedKey(key);
  }, []);

  const { data, error: errorSettings } = useSettings({
    onError: () => {
      toast.error<string>(t("Unable to load settings"));
    },
  });

  useEffect(() => {
    if (data) {
      i18n.changeLanguage(data?.language);
    }
  }, [data]);

  const Menu = (
    <RoutesMenu
      routeLinks={navLinks}
      selectedKey={selectedKey}
      changeSelectedKey={changeSelectedKey}
    />
  );

  return (
    <ConfigProvider
      theme={{
        algorithm: isDarkMode ? theme.darkAlgorithm : theme.defaultAlgorithm,
      }}
    >
      <div className="App">
        <TopNavBar menu={Menu} changeTheme={handChangeTheme} />
        <Layout>
          <SideBar menu={Menu} />
          <Layout.Content>
            {errorSettings && (
              <div>Unable to fetch application&apos;s settings.</div>
            )}
            <Outlet />
            <PageFooter />
          </Layout.Content>
        </Layout>
      </div>
    </ConfigProvider>
  );
}

export default App;
