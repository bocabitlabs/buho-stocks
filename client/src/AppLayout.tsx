import React, { useCallback, useState } from "react";
import "./index.css";
import "./App.css";
import { Outlet } from "react-router-dom";
import { Layout, theme } from "antd";
import { navLinks } from "components/AppSidebar/AppSidebar";
import LoadingSpin from "components/LoadingSpin/LoadingSpin";
import PageFooter from "components/PageFooter/PageFooter";
import RoutesMenu from "components/RoutesMenu/RoutesMenu";
import TopNavBar from "components/TopNavBar/TopNavBar";

const { useToken } = theme;

function AppLayout({ changeTheme }: { changeTheme: () => void }) {
  const { token } = useToken();

  const [selectedKey, setSelectedKey] = useState<string>("0");
  const changeSelectedKey = useCallback((event: any) => {
    const { key } = event;
    setSelectedKey(key);
  }, []);

  const Menu = (
    <RoutesMenu
      routeLinks={navLinks}
      selectedKey={selectedKey}
      changeSelectedKey={changeSelectedKey}
    />
  );

  return (
    <React.Suspense fallback={<LoadingSpin />}>
      <Layout style={{ minHeight: "100vh" }}>
        <Layout.Sider
          width={250}
          className="sidebar"
          breakpoint="lg"
          theme="light"
          collapsedWidth={0}
          trigger={null}
          style={{ borderRight: `1px solid ${token.colorBorder}` }}
        >
          <div style={{ flex: 1 }}>
            <div style={{ flex: 1, position: "sticky", top: 0, left: 0 }}>
              {Menu}
            </div>
          </div>
        </Layout.Sider>
        <Layout.Content>
          <TopNavBar menu={Menu} changeTheme={changeTheme} />
          <Outlet />
          <PageFooter />
        </Layout.Content>
      </Layout>
    </React.Suspense>
  );
}

export default AppLayout;
