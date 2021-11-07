import {
  BankOutlined,
  BookOutlined,
  ClusterOutlined,
  DollarCircleOutlined,
  HomeOutlined,
  ImportOutlined,
  SettingOutlined
} from "@ant-design/icons";
import { Menu } from "antd";
import React, { ReactElement, useEffect, useState } from "react";
import { useHistory, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
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
    icon: <HomeOutlined />
  },
  {
    key: "1",
    path: "/app/portfolios",
    text: "Portfolios",
    icon: <BookOutlined />
  },
  { key: "2", path: "/app/markets", text: "Markets", icon: <BankOutlined /> },
  {
    key: "3",
    path: "/app/currencies",
    text: "Currencies",
    icon: <DollarCircleOutlined />
  },
  {
    key: "4",
    path: "/app/sectors",
    text: "Sectors",
    icon: <ClusterOutlined />
  },
  {
    key: "5",
    path: "/app/import-export",
    text: "Import & Export",
    icon: <ImportOutlined />
  },

  {
    key: "6",
    path: "/app/settings",
    text: "Settings",
    icon: <SettingOutlined />
  }
];

export default function AppSidebar(): ReactElement {
  const history = useHistory();
  const location = useLocation();
  const { t } = useTranslation();

  const [selectedKey, setSelectedKey] = useState(
    navLinks.find((item) => location.pathname.startsWith(item.path))?.key || ""
  );

  const onClickMenu = (item: any) => {
    const clicked = navLinks.find((_item) => _item.key === item.key);
    history.push(clicked?.path || "");
  };

  useEffect(() => {
    const selected =
      navLinks.find((item) => location.pathname.startsWith(item.path))?.key ||
      "";
    setSelectedKey(selected);
  }, [location]);

  return (
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
    </Menu>
  );
}
