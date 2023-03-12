import React from "react";
import {
  BankOutlined,
  ClusterOutlined,
  DollarCircleOutlined,
  HomeOutlined,
  SettingOutlined,
  SyncOutlined,
} from "@ant-design/icons";
import getRoute, { HOME_ROUTE } from "routes";
import { RoutePathProps } from "types/routes";

export const navLinks: RoutePathProps[] = [
  {
    key: "0",
    path: getRoute(HOME_ROUTE),
    text: "Home",
    icon: <HomeOutlined />,
  },
  { key: "1", path: "/markets", text: "Markets", icon: <BankOutlined /> },
  {
    key: "2",
    path: "/sectors",
    text: "Sectors",
    icon: <ClusterOutlined />,
  },
  {
    key: "3",
    path: "/currencies",
    text: "Currencies",
    icon: <DollarCircleOutlined />,
  },
  {
    key: "4",
    path: "/import-export",
    text: "Import & Export",
    icon: <SyncOutlined />,
  },
  {
    key: "5",
    path: "/settings",
    text: "Settings",
    icon: <SettingOutlined />,
  },
];

export default navLinks;
