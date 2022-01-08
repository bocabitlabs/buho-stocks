import React, { ReactElement, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useLocation, useNavigate } from "react-router-dom";
import {
  BankOutlined,
  ClusterOutlined,
  DollarCircleOutlined,
  HomeOutlined,
  SettingOutlined,
  SyncOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { Layout, Menu } from "antd";
import SubMenu from "antd/lib/menu/SubMenu";
import LogoutButton from "components/LogoutButton/LogoutButton";
import getRoute, { HOME_ROUTE } from "routes";

interface RoutePathProps {
  key: string;
  path: string;
  text: string;
  icon: ReactElement;
}

const navLinks: RoutePathProps[] = [
  {
    key: "0",
    path: getRoute(HOME_ROUTE),
    text: "Home",
    icon: <HomeOutlined />,
  },
  { key: "2", path: "/app/markets", text: "Markets", icon: <BankOutlined /> },
  {
    key: "3",
    path: "/app/currencies",
    text: "Currencies",
    icon: <DollarCircleOutlined />,
  },
  {
    key: "4",
    path: "/app/sectors",
    text: "Sectors",
    icon: <ClusterOutlined />,
  },
  {
    key: "5",
    path: "/app/import-export",
    text: "Import & Export",
    icon: <SyncOutlined />,
  },
  {
    key: "6",
    path: "/app/settings",
    text: "Settings",
    icon: <SettingOutlined />,
  },
];

export default function AppSidebar(): ReactElement {
  const location = useLocation();
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [selectedKey, setSelectedKey] = useState(
    navLinks.find((item) => location.pathname.startsWith(item.path))?.key || "",
  );

  const onClickMenu = (item: any) => {
    const clicked = navLinks.find((_item) => _item.key === item.key);
    navigate(clicked?.path || "");
  };

  useEffect(() => {
    const selected =
      navLinks.find((item) => location.pathname.startsWith(item.path))?.key ||
      "";
    setSelectedKey(selected);
  }, [location]);

  return (
    <Layout.Sider
      theme="light"
      breakpoint="lg"
      collapsedWidth="0"
      onBreakpoint={(broken) => {
        console.log(broken);
      }}
      onCollapse={(collapsed, type) => {
        console.log(collapsed, type);
      }}
    >
      <Menu
        theme="light"
        mode="inline"
        onClick={onClickMenu}
        selectedKeys={[selectedKey]}
        style={{ marginTop: 20 }}
      >
        {navLinks.map((item) => (
          <Menu.Item key={item.key} icon={item.icon}>
            {t(item.text)}
          </Menu.Item>
        ))}
        <SubMenu key="sub1" icon={<UserOutlined />} title="Account">
          <LogoutButton />
        </SubMenu>
      </Menu>
    </Layout.Sider>
  );
}
