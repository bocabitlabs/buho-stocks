import React, { useCallback, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useLocation, useNavigate } from "react-router-dom";
import {
  BankOutlined,
  ClusterOutlined,
  DollarCircleOutlined,
  HomeOutlined,
  SettingOutlined,
  SyncOutlined,
} from "@ant-design/icons";
import { Menu } from "antd";
import type { MenuProps } from "antd";
import getRoute, { HOME_ROUTE } from "routes";
import { RoutePathProps } from "types/routes";

type MenuItem = Required<MenuProps>["items"][number];

function getItem(
  label: React.ReactNode,
  key: React.Key,
  path: string,
  icon?: React.ReactNode,
  children?: MenuItem[],
  type?: "group",
): MenuItem {
  return {
    key,
    path,
    icon,
    children,
    label,
    type,
  } as MenuItem;
}

export interface RoutesMenuProps {
  routeLinks: RoutePathProps[];
  selectedKey: string;
  changeSelectedKey: any;
  extraCallback?: Function;
}

function RoutesMenu({
  routeLinks,
  selectedKey,
  changeSelectedKey,
  extraCallback,
}: RoutesMenuProps) {
  const location = useLocation();
  const { t } = useTranslation();
  const navigate = useNavigate();

  const items: MenuItem[] = [
    getItem(t("Home"), "0", getRoute(HOME_ROUTE), <HomeOutlined />),
    getItem(t("Markets"), "1", "/app/markets/", <BankOutlined />),
    getItem(t("Currencies"), "2", "/app/currencies/", <DollarCircleOutlined />),
    getItem(t("Sectors"), "3", "/app/sectors/", <ClusterOutlined />),
    getItem(t("Import & Export"), "4", "/app/import-export/", <SyncOutlined />),
    getItem(t("Settings"), "5", "/app/settings/", <SettingOutlined />),
  ];

  const menuClickAction = useCallback(
    (event: any) => {
      const { key } = event;
      changeSelectedKey(event);
      navigate(routeLinks.find((item) => item.key === key)?.path || "");
      if (extraCallback) extraCallback();
    },
    [changeSelectedKey, extraCallback, navigate, routeLinks],
  );

  const updateSelectedKey = useCallback(
    (event: any) => {
      const { key } = event;
      changeSelectedKey(event);
      navigate(routeLinks.find((item) => item.key === key)?.path || "");
    },
    [changeSelectedKey, navigate, routeLinks],
  );

  useEffect(() => {
    const selected =
      routeLinks.find((item) => location.pathname.startsWith(item.path))?.key ||
      "";
    if (selected) {
      updateSelectedKey(routeLinks[Number(selected)]);
    }
  }, [location.pathname, updateSelectedKey, routeLinks]);

  return (
    <Menu
      onClick={menuClickAction}
      mode="inline"
      selectedKeys={[selectedKey]}
      items={items}
    />
  );
}
RoutesMenu.defaultProps = {
  extraCallback: () => {},
};
export default RoutesMenu;
